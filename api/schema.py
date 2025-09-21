import logging
import re
from collections import Counter, defaultdict
from datetime import timedelta

import graphene
import graphql_jwt
from django.db.models import Q, Count
from django.utils import timezone
from graphql_jwt.decorators import login_required
from graphene_django.filter import DjangoFilterConnectionField

from .models import *
from .schemafiles.Nodes import *
from .schemafiles.mutations import *

logger = logging.getLogger(__name__)


HASHTAG_PATTERN = re.compile(r"#([\w\d_]{2,50})", re.UNICODE)


def _extract_hashtags(text):
    if not text:
        return []
    return HASHTAG_PATTERN.findall(text)


def _summarize_text(value, limit=140):
    if not value:
        return ""

    compact = re.sub(r"\s+", " ", value).strip()
    if len(compact) <= limit:
        return compact
    return compact[: limit - 1].rstrip() + "\u2026"


def _calculate_posting_streak(posts_qs, lookback_days=90):
    if posts_qs is None:
        return 0

    cutoff = timezone.now() - timedelta(days=lookback_days)
    ordered_dates = []
    seen_dates = set()

    timestamps = (
        posts_qs.filter(created_at__gte=cutoff)
        .exclude(created_at__isnull=True)
        .order_by("-created_at")
        .values_list("created_at", flat=True)
    )

    for created_at in timestamps:
        local_date = timezone.localtime(created_at).date()
        if local_date in seen_dates:
            continue
        seen_dates.add(local_date)
        ordered_dates.append(local_date)

    if not ordered_dates:
        return 0

    streak = 1
    for index in range(1, len(ordered_dates)):
        previous = ordered_dates[index - 1]
        current = ordered_dates[index]
        if (previous - current).days == 1:
            streak += 1
        else:
            break

    return streak


def _build_momentum_milestone(follower_count):
    milestones = [10, 25, 50, 100, 250, 500, 1000, 2500, 5000]
    follower_total = max(0, follower_count or 0)

    for target in milestones:
        if follower_total < target:
            progress_ratio = follower_total / float(target) if target else 0.0
            return {
                "label": f"{target} followers",
                "target": target,
                "remaining": target - follower_total,
                "achieved": False,
                "progress_ratio": progress_ratio,
            }

    if follower_total == 0:
        return {
            "label": "First follower",
            "target": 1,
            "remaining": 1,
            "achieved": False,
            "progress_ratio": 0.0,
        }

    return {
        "label": "Community legend",
        "target": follower_total,
        "remaining": 0,
        "achieved": True,
        "progress_ratio": 1.0,
    }


class PlatformInsightsType(graphene.ObjectType):
    total_users = graphene.Int()
    total_posts = graphene.Int()
    total_comments = graphene.Int()
    total_likes = graphene.Int()
    posts_today = graphene.Int()
    active_this_week = graphene.Int()
    new_users_this_week = graphene.Int()
    average_likes_per_post = graphene.Float()
    average_comments_per_post = graphene.Float()
    engagement_rate = graphene.Float()
    active_percentage = graphene.Float()


class HashtagHighlightType(graphene.ObjectType):
    tag = graphene.String()
    mention_count = graphene.Int()
    post_count = graphene.Int()


class CreatorSpotlightType(graphene.ObjectType):
    user = graphene.Field(UserNode)
    posts_this_week = graphene.Int()
    recent_like_count = graphene.Int()
    latest_post_id = graphene.ID()
    latest_post_title = graphene.String()
    latest_post_excerpt = graphene.String()
    latest_post_created_at = graphene.DateTime()


class MomentumMilestoneType(graphene.ObjectType):
    label = graphene.String()
    target = graphene.Int()
    remaining = graphene.Int()
    achieved = graphene.Boolean()
    progress_ratio = graphene.Float()


class SupporterSpotlightType(graphene.ObjectType):
    user = graphene.Field(UserNode)
    comment_count = graphene.Int()
    like_count = graphene.Int()
    cheer_score = graphene.Int()


class FocusHashtagType(graphene.ObjectType):
    tag = graphene.String()
    use_count = graphene.Int()
    last_used_post_id = graphene.ID()
    last_used_at = graphene.DateTime()


class MomentumTrendPointType(graphene.ObjectType):
    label = graphene.String()
    posts = graphene.Int()
    comments = graphene.Int()
    likes = graphene.Int()
    interactions = graphene.Int()
    momentum_delta = graphene.Int()


class MomentumRecommendationType(graphene.ObjectType):
    title = graphene.String()
    description = graphene.String()
    action_text = graphene.String()


class MomentumAchievementType(graphene.ObjectType):
    title = graphene.String()
    description = graphene.String()
    earned = graphene.Boolean()
    earned_at = graphene.DateTime()


class PersonalMomentumType(graphene.ObjectType):
    posting_streak = graphene.Int()
    last_post_created_at = graphene.DateTime()
    posts_last_week = graphene.Int()
    posts_last_month = graphene.Int()
    likes_on_recent_posts = graphene.Int()
    comments_last_week = graphene.Int()
    momentum_score = graphene.Float()
    highlight = graphene.String()
    supporter_total = graphene.Int()
    milestone = graphene.Field(MomentumMilestoneType)
    supporter_spotlight = graphene.List(SupporterSpotlightType)
    breakout_posts = graphene.List(PostNode)
    focus_hashtags = graphene.List(FocusHashtagType)
    trend = graphene.List(MomentumTrendPointType)
    next_actions = graphene.List(MomentumRecommendationType)
    achievements = graphene.List(MomentumAchievementType)


class CommunityChallengeType(graphene.ObjectType):
    id = graphene.String()
    title = graphene.String()
    description = graphene.String()
    hashtag = graphene.String()
    participants = graphene.Int()
    momentum_boost = graphene.Float()
    duration = graphene.String()
    is_active = graphene.Boolean()
    sample_post = graphene.Field(PostNode)


class Query(object):
    posts = DjangoFilterConnectionField(PostNode, id=graphene.ID(
    ), post_title=graphene.String(), post_text=graphene.String())
    following_posts = DjangoFilterConnectionField(PostNode, id=graphene.ID(
    ), post_title=graphene.String(), post_text=graphene.String())
    self_post = DjangoFilterConnectionField(
        PostNode, post_title=graphene.String(), post_text=graphene.String())
    user_post = DjangoFilterConnectionField(PostNode, id=graphene.ID(
    ), post_title=graphene.String(), post_text=graphene.String())
    self_user = graphene.Field(UserNode)
    user_get = graphene.Field(UserNode, id=graphene.ID())
    comments = DjangoFilterConnectionField(CommentNode)
    post_comments = DjangoFilterConnectionField(CommentNode, id=graphene.ID())
    is_following = graphene.Boolean(id=graphene.ID())
    liked = graphene.Boolean(id=graphene.ID())
    self_notification = DjangoFilterConnectionField(NotificationNode)
    notification_number = graphene.Int()
    trending_posts = graphene.List(PostNode, limit=graphene.Int(default_value=5))
    trending_hashtags = graphene.List(HashtagHighlightType, limit=graphene.Int(default_value=8))
    creator_spotlight = graphene.List(CreatorSpotlightType, limit=graphene.Int(default_value=4))
    suggested_users = graphene.List(UserNode, limit=graphene.Int(default_value=5))
    platform_insights = graphene.Field(PlatformInsightsType)
    personal_momentum = graphene.Field(
        PersonalMomentumType,
        supporter_limit=graphene.Int(default_value=4),
        breakout_limit=graphene.Int(default_value=3),
    )
    community_challenges = graphene.List(
        CommunityChallengeType, limit=graphene.Int(default_value=3)
    )

    @login_required
    def resolve_notification_number(self, info):
        return Notification.objects.filter(read=False, recipient=info.context.user).distinct().count()
    # Get notifications for currently logged in user

    @login_required
    def resolve_self_notification(self, info, **kwargs):
        return Notification.objects.filter(recipient=info.context.user).distinct()

    def resolve_platform_insights(self, info, **kwargs):
        now = timezone.now()
        week_ago = now - timedelta(days=7)
        today = now.date()

        total_users = User.objects.count()
        total_posts = Post.objects.count()
        total_comments = Comment.objects.count()
        total_likes = Like.objects.count()
        posts_today = Post.objects.filter(created_at__date=today).count()
        active_this_week = User.objects.filter(posts__created_at__gte=week_ago).distinct().count()
        new_users_this_week = User.objects.filter(date_joined__gte=week_ago).count()

        safe_post_total = total_posts or 1
        average_likes = total_likes / safe_post_total if total_posts else 0.0
        average_comments = total_comments / safe_post_total if total_posts else 0.0
        engagement_rate = (total_likes + total_comments) / safe_post_total if total_posts else 0.0
        active_percentage = active_this_week / total_users if total_users else 0.0

        return PlatformInsightsType(
            total_users=total_users,
            total_posts=total_posts,
            total_comments=total_comments,
            total_likes=total_likes,
            posts_today=posts_today,
            active_this_week=active_this_week,
            new_users_this_week=new_users_this_week,
            average_likes_per_post=average_likes,
            average_comments_per_post=average_comments,
            engagement_rate=engagement_rate,
            active_percentage=active_percentage,
        )

    def resolve_post_comments(self, info, id, **kwargs):
        return Comment.objects.filter(post=Post.objects.get(id=id))

    def resolve_user_get(self, info, id, **kwargs):
        try:
            return User.objects.get(id=id)
        except User.DoesNotExist:
            return None

    @login_required
    def resolve_self_post(self, info, **kwargs):
        return info.context.user.posts

    @login_required
    def resolve_following_posts(self, info, **kwargs):
        return Post.objects.filter(Q(user__followers__follower=info.context.user) | Q(user=info.context.user)).distinct()

    @login_required
    def resolve_user_post(self, info, id, **kwargs):
        return Post.objects.filter(user=User.objects.get(id=id))

    def resolve_trending_posts(self, info, limit=5, **kwargs):
        limit = max(1, limit or 5)
        window_start = timezone.now() - timedelta(days=7)

        base_queryset = Post.objects.filter(created_at__gte=window_start)
        trending = list(
            base_queryset
            .annotate(
                like_total=Count("likes", distinct=True),
                comment_total=Count("comments", distinct=True),
            )
            .order_by("-like_total", "-comment_total", "-created_at")[:limit]
        )

        if len(trending) < limit:
            fallback = (
                Post.objects.exclude(id__in=[post.id for post in trending])
                .annotate(
                    like_total=Count("likes", distinct=True),
                    comment_total=Count("comments", distinct=True),
                )
                .order_by("-like_total", "-comment_total", "-created_at")[: limit - len(trending)]
            )
            trending.extend(list(fallback))

        return trending

    def resolve_trending_hashtags(self, info, limit=8, **kwargs):
        limit = max(1, limit or 8)
        window_start = timezone.now() - timedelta(days=7)

        posts = Post.objects.filter(created_at__gte=window_start).only("id", "text")

        mention_counter = Counter()
        posts_per_tag = defaultdict(set)
        display_names = {}

        for post in posts:
            hashtags = _extract_hashtags(post.text)
            if not hashtags:
                continue

            for raw_tag in hashtags:
                normalized = raw_tag.lower()
                mention_counter[normalized] += 1
                posts_per_tag[normalized].add(post.pk)
                display_names.setdefault(normalized, raw_tag)

        ranked = sorted(
            mention_counter.items(),
            key=lambda item: (-item[1], display_names[item[0]].lower()),
        )

        highlights = []
        for normalized, count in ranked[:limit]:
            highlights.append(
                HashtagHighlightType(
                    tag=f"#{display_names[normalized]}",
                    mention_count=count,
                    post_count=len(posts_per_tag[normalized]),
                )
            )

        return highlights

    def resolve_personal_momentum(self, info, supporter_limit=4, breakout_limit=3, **kwargs):
        user = info.context.user
        if not user or user.is_anonymous:
            return None

        supporter_limit = max(1, supporter_limit or 1)
        breakout_limit = max(1, breakout_limit or 1)

        now = timezone.now()
        week_ago = now - timedelta(days=7)
        month_ago = now - timedelta(days=30)

        posts_qs = Post.objects.filter(user=user).order_by("-created_at")
        last_post = posts_qs.first()
        posts_last_week = posts_qs.filter(created_at__gte=week_ago).count()
        posts_last_month = posts_qs.filter(created_at__gte=month_ago).count()

        likes_recent_month = Like.objects.filter(
            post__user=user, post__created_at__gte=month_ago
        ).count()
        likes_recent_week = Like.objects.filter(
            post__user=user, post__created_at__gte=week_ago
        ).count()

        comments_last_week = Comment.objects.filter(
            post__user=user, created_at__gte=week_ago
        ).count()

        posting_streak = _calculate_posting_streak(posts_qs)

        breakout_posts = list(
            posts_qs.filter(created_at__gte=month_ago)
            .annotate(
                like_total=Count("likes", distinct=True),
                comment_total=Count("comments", distinct=True),
            )
            .order_by("-like_total", "-comment_total", "-created_at")[:breakout_limit]
        )

        comment_supporters = (
            Comment.objects.filter(post__user=user, created_at__gte=month_ago)
            .exclude(user=user)
            .values("user_id")
            .annotate(comment_total=Count("id"))
        )
        like_supporters = (
            Like.objects.filter(post__user=user, post__created_at__gte=month_ago)
            .exclude(user=user)
            .values("user_id")
            .annotate(like_total=Count("id"))
        )

        supporter_metrics = {}
        for entry in comment_supporters:
            metrics = supporter_metrics.setdefault(entry["user_id"], {"comment_count": 0, "like_count": 0})
            metrics["comment_count"] = entry["comment_total"]

        for entry in like_supporters:
            metrics = supporter_metrics.setdefault(entry["user_id"], {"comment_count": 0, "like_count": 0})
            metrics["like_count"] = entry["like_total"]

        supporter_total = len(supporter_metrics)
        ranked_supporters = []
        for supporter_id, metrics in supporter_metrics.items():
            cheer_score = metrics["like_count"] + metrics["comment_count"] * 2
            ranked_supporters.append(
                (supporter_id, cheer_score, metrics["comment_count"], metrics["like_count"])
            )

        ranked_supporters.sort(key=lambda item: (-item[1], -item[2], -item[3]))
        selected_supporters = ranked_supporters[:supporter_limit]
        supporter_users = {
            user.pk: user
            for user in User.objects.filter(pk__in=[item[0] for item in selected_supporters])
        }

        supporter_spotlight = []
        for supporter_id, cheer_score, comment_count, like_count in selected_supporters:
            supporter_user = supporter_users.get(supporter_id)
            if supporter_user is None:
                continue
            supporter_spotlight.append(
                SupporterSpotlightType(
                    user=supporter_user,
                    comment_count=comment_count,
                    like_count=like_count,
                    cheer_score=cheer_score,
                )
            )

        trend_points = []
        previous_interactions = None
        for offset in range(3, -1, -1):
            period_end = now - timedelta(days=7 * offset)
            period_start = period_end - timedelta(days=7)
            if offset == 0:
                label = "This week"
            elif offset == 1:
                label = "Last week"
            else:
                label = f"{offset} weeks ago"

            period_posts = posts_qs.filter(
                created_at__gte=period_start, created_at__lt=period_end
            )
            period_counts = period_posts.aggregate(
                likes_total=Count("likes", distinct=True),
                comments_total=Count("comments", distinct=True),
            )
            posts_count = period_posts.count()
            likes_total = period_counts.get("likes_total") or 0
            comments_total = period_counts.get("comments_total") or 0
            interactions = likes_total + comments_total

            delta = 0
            if previous_interactions is not None:
                delta = interactions - previous_interactions

            trend_points.append(
                MomentumTrendPointType(
                    label=label,
                    posts=posts_count,
                    comments=comments_total,
                    likes=likes_total,
                    interactions=interactions,
                    momentum_delta=delta,
                )
            )
            previous_interactions = interactions

        recent_post_window = now - timedelta(days=60)
        recent_posts = posts_qs.filter(created_at__gte=recent_post_window)
        hashtag_usage = Counter()
        hashtag_latest = {}

        for post in recent_posts:
            for raw_tag in _extract_hashtags(post.text):
                normalized = raw_tag.lower()
                hashtag_usage[normalized] += 1
                latest_entry = hashtag_latest.get(normalized)
                if (
                    latest_entry is None
                    or (post.created_at and post.created_at > latest_entry["created_at"])
                ):
                    hashtag_latest[normalized] = {
                        "created_at": post.created_at,
                        "post_id": post.pk,
                        "display": raw_tag,
                    }

        focus_hashtags = []
        for normalized, count in sorted(
            hashtag_usage.items(),
            key=lambda item: (
                item[1],
                hashtag_latest[item[0]]["created_at"].timestamp()
                if (
                    hashtag_latest.get(item[0])
                    and hashtag_latest[item[0]].get("created_at")
                )
                else 0,
            ),
            reverse=True,
        )[:5]:
            latest_entry = hashtag_latest.get(normalized)
            if not latest_entry:
                continue
            display = latest_entry["display"]
            tag_value = f"#{display}" if display else f"#{normalized}"
            focus_hashtags.append(
                FocusHashtagType(
                    tag=tag_value,
                    use_count=count,
                    last_used_post_id=str(latest_entry["post_id"])
                    if latest_entry.get("post_id")
                    else None,
                    last_used_at=latest_entry.get("created_at"),
                )
            )

        next_actions = []

        def _add_action(title, description, action_text=None):
            if not title or any(action.title == title for action in next_actions):
                return
            next_actions.append(
                MomentumRecommendationType(
                    title=title,
                    description=description,
                    action_text=action_text,
                )
            )

        if posts_last_week < 3:
            _add_action(
                "Set a mini publishing sprint",
                "Share three moments this week to keep your audience tuned in.",
                "Map out your next three updates",
            )

        if posting_streak < 2:
            _add_action(
                "Ignite your streak",
                "Post two days in a row to unlock a hot streak badge and bonus visibility.",
                "Drop something new today",
            )

        if supporter_total and supporter_spotlight:
            lead_supporter = supporter_spotlight[0]
            _add_action(
                "Celebrate your top supporter",
                f"Shout out {lead_supporter.user.username} to keep the cheer squad energized.",
                "Send a thank-you DM",
            )

        if breakout_posts:
            headline_post = breakout_posts[0]
            _add_action(
                "Ride your breakout wave",
                f"Follow up on \"{headline_post.title}\" with a behind-the-scenes post while it’s buzzing.",
                "Sketch the sequel post",
            )

        if not focus_hashtags:
            _add_action(
                "Experiment with a fresh theme",
                "Try a new hashtag to reach creators outside your usual circle.",
                "Brainstorm a signature hashtag",
            )

        if not next_actions:
            _add_action(
                "Keep the energy flowing",
                "Schedule your next share so your momentum never cools off.",
                "Plan tomorrow’s update",
            )

        achievements = []

        def _add_achievement(title, description, earned, earned_at=None):
            achievements.append(
                MomentumAchievementType(
                    title=title,
                    description=description,
                    earned=bool(earned),
                    earned_at=earned_at if earned else None,
                )
            )

        latest_post_at = last_post.created_at if last_post else None
        _add_achievement(
            "First spark",
            "Publish your first story to light up your creator profile.",
            bool(last_post),
            latest_post_at,
        )
        _add_achievement(
            "Weekly streak",
            "Post on three different days this week to build a streak.",
            posting_streak >= 3,
            latest_post_at if posting_streak >= 3 else None,
        )
        _add_achievement(
            "Collaboration champion",
            "Gather cheers from three supporters in the last month.",
            supporter_total >= 3,
            latest_post_at if supporter_total >= 3 else None,
        )
        _add_achievement(
            "Conversation catalyst",
            "Spark at least five comments on your posts this week.",
            comments_last_week >= 5,
            latest_post_at if comments_last_week >= 5 else None,
        )
        _add_achievement(
            "Fan favorite",
            "Earn fifteen likes across your posts this week.",
            likes_recent_week >= 15,
            latest_post_at if likes_recent_week >= 15 else None,
        )
        _add_achievement(
            "Publishing pro",
            "Share eight updates this month to keep the feed thriving.",
            posts_last_month >= 8,
            latest_post_at if posts_last_month >= 8 else None,
        )

        raw_score = (
            posts_last_week * 12
            + posts_last_month * 4
            + likes_recent_week * 2
            + comments_last_week * 5
            + posting_streak * 6
        )
        momentum_score = min(100.0, round(raw_score, 2))

        milestone_data = _build_momentum_milestone(user.follower_count)
        milestone = MomentumMilestoneType(**milestone_data) if milestone_data else None

        if posts_last_week >= 5:
            highlight = "You're unstoppable—five fresh posts already this week."
        elif posting_streak >= 3:
            highlight = f"{posting_streak}-day posting streak. Keep the flame alive!"
        elif supporter_total >= 3:
            highlight = f"{supporter_total} supporters cheered you on recently."
        elif posts_last_week == 0 and posts_last_month == 0:
            highlight = "Kick off your journey—share your first story to unlock tailored insights."
        else:
            highlight = "Share another update today to send your momentum soaring."

        return PersonalMomentumType(
            posting_streak=posting_streak,
            last_post_created_at=last_post.created_at if last_post else None,
            posts_last_week=posts_last_week,
            posts_last_month=posts_last_month,
            likes_on_recent_posts=likes_recent_month,
            comments_last_week=comments_last_week,
            momentum_score=momentum_score,
            highlight=highlight,
            supporter_total=supporter_total,
            milestone=milestone,
            supporter_spotlight=supporter_spotlight,
            breakout_posts=breakout_posts,
            focus_hashtags=focus_hashtags,
            trend=trend_points,
            next_actions=next_actions,
            achievements=achievements,
        )

    def resolve_community_challenges(self, info, limit=3, **kwargs):
        limit = max(1, limit or 3)
        window_start = timezone.now() - timedelta(days=14)

        posts = list(
            Post.objects.filter(created_at__gte=window_start)
            .annotate(
                like_total=Count("likes", distinct=True),
                comment_total=Count("comments", distinct=True),
            )
            .select_related("user")
        )

        if not posts:
            return []

        total_interactions = sum(
            (getattr(post, "like_total", 0) or 0)
            + (getattr(post, "comment_total", 0) or 0)
            for post in posts
        )
        total_interactions = total_interactions or 1

        challenge_map = {}
        for post in posts:
            hashtags = _extract_hashtags(post.text)
            if not hashtags:
                continue

            interactions = (getattr(post, "like_total", 0) or 0) + (
                getattr(post, "comment_total", 0) or 0
            )
            created_at = post.created_at

            for raw_tag in hashtags:
                normalized = raw_tag.lower()
                entry = challenge_map.setdefault(
                    normalized,
                    {
                        "display": raw_tag,
                        "mention_count": 0,
                        "user_ids": set(),
                        "interactions": 0,
                        "latest": None,
                        "earliest": None,
                        "sample_post": None,
                    },
                )

                if not entry["display"]:
                    entry["display"] = raw_tag
                entry["mention_count"] += 1
                entry["user_ids"].add(post.user_id)
                entry["interactions"] += interactions

                if created_at:
                    if entry["latest"] is None or created_at > entry["latest"]:
                        entry["latest"] = created_at
                    if entry["earliest"] is None or created_at < entry["earliest"]:
                        entry["earliest"] = created_at
                    current_sample = entry.get("sample_post")
                    if (
                        current_sample is None
                        or current_sample.created_at is None
                        or (
                            current_sample.created_at
                            and created_at > current_sample.created_at
                        )
                    ):
                        entry["sample_post"] = post

        if not challenge_map:
            return []

        ranked_entries = []
        now = timezone.now()
        for normalized, entry in challenge_map.items():
            latest_at = entry["latest"]
            participants = len(entry["user_ids"])
            mention_count = entry["mention_count"]
            interactions = entry["interactions"] or 0

            recency_bonus = 1.0
            if latest_at and latest_at >= now - timedelta(days=2):
                recency_bonus += 0.35
            if mention_count >= 4:
                recency_bonus += 0.25
            if participants >= 5:
                recency_bonus += 0.35

            score = interactions * recency_bonus + participants * 3 + mention_count
            ranked_entries.append((normalized, entry, score))

        ranked_entries.sort(key=lambda item: item[2], reverse=True)

        challenges = []
        for normalized, entry, _ in ranked_entries[:limit]:
            display_tag = entry["display"] or normalized
            hashtag_label = f"#{display_tag}"
            participants = len(entry["user_ids"])
            mention_count = entry["mention_count"]
            interactions = entry["interactions"] or 0
            latest_at = entry["latest"]
            earliest_at = entry["earliest"] or latest_at

            if latest_at and earliest_at:
                active_days = max(
                    1, (timezone.localtime(latest_at).date() - timezone.localtime(earliest_at).date()).days + 1
                )
            else:
                active_days = 1

            if active_days <= 3:
                duration = "Weekend dash"
            elif active_days <= 7:
                duration = "7-day sprint"
            elif active_days <= 14:
                duration = "Two-week wave"
            else:
                duration = "Season-long series"

            participant_label = "creator" if participants == 1 else "creators"
            post_label = "story" if mention_count == 1 else "stories"
            description = (
                f"{participants} {participant_label} have shared {mention_count} {post_label} with {hashtag_label} recently. "
                "Add yours to amplify the momentum."
            )

            momentum_boost = interactions / float(total_interactions)
            is_active = bool(latest_at and latest_at >= now - timedelta(days=3))

            challenges.append(
                CommunityChallengeType(
                    id=f"challenge-{normalized}",
                    title=f"{display_tag.title()} creator challenge",
                    description=description,
                    hashtag=hashtag_label,
                    participants=participants,
                    momentum_boost=momentum_boost,
                    duration=duration,
                    is_active=is_active,
                    sample_post=entry.get("sample_post"),
                )
            )

        return challenges

    @login_required
    def resolve_suggested_users(self, info, limit=5, **kwargs):
        limit = max(1, limit or 5)
        user = info.context.user

        following_ids = list(
            Following.objects.filter(follower=user).values_list("target_id", flat=True)
        )

        base_queryset = (
            User.objects.exclude(pk=user.pk)
            .annotate(
                follower_total=Count("followers", distinct=True),
                post_total=Count("posts", distinct=True),
            )
        )

        primary = list(
            base_queryset
            .exclude(pk__in=following_ids)
            .order_by("-follower_total", "-post_total", "username")[:limit]
        )

        if len(primary) < limit:
            remaining = limit - len(primary)
            fallback = (
                base_queryset
                .exclude(pk__in=[u.pk for u in primary])
                .order_by("-follower_total", "-post_total", "username")[:remaining]
            )
            primary.extend(list(fallback))

        return primary

    @login_required
    def resolve_creator_spotlight(self, info, limit=4, **kwargs):
        limit = max(1, limit or 4)
        user = info.context.user
        window_start = timezone.now() - timedelta(days=14)
        recent_join_window = timezone.now() - timedelta(days=45)

        base_queryset = (
            User.objects.exclude(pk=user.pk)
            .annotate(
                posts_recent=Count(
                    "posts",
                    filter=Q(posts__created_at__gte=window_start),
                    distinct=True,
                ),
                likes_recent=Count(
                    "posts__likes",
                    filter=Q(posts__created_at__gte=window_start),
                    distinct=True,
                ),
            )
            .filter(posts_recent__gt=0)
        )

        primary_candidates = list(
            base_queryset
            .filter(date_joined__gte=recent_join_window)
            .order_by("-posts_recent", "-likes_recent", "username")[:limit]
        )

        selected = list(primary_candidates)

        if len(selected) < limit:
            fallback = (
                base_queryset
                .exclude(pk__in=[candidate.pk for candidate in selected])
                .order_by("-posts_recent", "-likes_recent", "username")[: limit - len(selected)]
            )
            selected.extend(list(fallback))

        selected = selected[:limit]
        user_ids = [creator.pk for creator in selected]

        latest_posts = {}
        if user_ids:
            recent_posts = (
                Post.objects.filter(user_id__in=user_ids, created_at__gte=window_start)
                .select_related("user")
                .order_by("-created_at")
            )
            for post in recent_posts:
                if post.user_id not in latest_posts:
                    latest_posts[post.user_id] = post

        spotlights = []
        for creator in selected:
            latest_post = latest_posts.get(creator.pk)
            if latest_post is None:
                latest_post = creator.posts.order_by("-created_at").first()

            spotlights.append(
                CreatorSpotlightType(
                    user=creator,
                    posts_this_week=getattr(creator, "posts_recent", 0),
                    recent_like_count=getattr(creator, "likes_recent", 0),
                    latest_post_id=str(latest_post.id) if latest_post else None,
                    latest_post_title=latest_post.title if latest_post else None,
                    latest_post_excerpt=_summarize_text(latest_post.text) if latest_post else "",
                    latest_post_created_at=latest_post.created_at if latest_post else None,
                )
            )

        return spotlights

    @login_required
    def resolve_self_user(self, info, **kwargs):
        return info.context.user

    def resolve_posts(self, info, **kwargs):
        id = kwargs.get('id')
        title = kwargs.get('title')
        text = kwargs.get('text')

        if id is not None:
            return Post.objects.filter(pk=id)
        elif text is not None and title is not None:
            return Post.objects.filter(text=text, title=title)
        elif text is not None:
            return Post.objects.filter(text=text)
        elif title is not None:
            return Post.objects.filter(title=title)

        return Post.objects.all()

    def resolve_comments(self, info, **kwargs):
        return Comment.objects.all()

    @login_required
    def resolve_liked(self, info, id, **kwargs):
        return len(Like.objects.filter(user=info.context.user, post=Post.objects.get(pk=id))) > 0


class Mutation(object):
    create_user = CreateUser.Field()
    revoke_token = graphql_jwt.relay.Revoke.Field()
    refresh_token = graphql_jwt.relay.Refresh.Field()
    token_auth = ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.relay.Verify.Field()
    update_user = UpdateUser.Field()
    create_post = CreatePost.Field()
    create_comment = CreateComment.Field()
    like_post = LikePost.Field()
    followUser = Follow.Field()
    read_notification = ReadNotification.Field()
    delete_token_cookie = graphql_jwt.relay.DeleteJSONWebTokenCookie.Field()
    delete_refresh_token_cookie = graphql_jwt.relay.DeleteRefreshTokenCookie.Field()


