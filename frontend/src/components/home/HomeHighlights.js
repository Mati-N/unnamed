import React, { useMemo, useState, useCallback } from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import RefreshIcon from "@material-ui/icons/Refresh";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import Divider from "@material-ui/core/Divider";
import LinearProgress from "@material-ui/core/LinearProgress";
import CircularProgress from "@material-ui/core/CircularProgress";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import PostAddIcon from "@material-ui/icons/PostAdd";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ForumIcon from "@material-ui/icons/Forum";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import EmojiEventsIcon from "@material-ui/icons/EmojiEvents";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import GroupWorkIcon from "@material-ui/icons/GroupWork";
import FlashOnIcon from "@material-ui/icons/FlashOn";
import BarChartIcon from "@material-ui/icons/BarChart";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import WbIncandescentIcon from "@material-ui/icons/WbIncandescent";
import LaunchIcon from "@material-ui/icons/Launch";
import TrendingDownIcon from "@material-ui/icons/TrendingDown";
import TrendingFlatIcon from "@material-ui/icons/TrendingFlat";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import FlagIcon from "@material-ui/icons/Flag";
import TimerIcon from "@material-ui/icons/Timer";
import { FOLLOW } from "../../Queries";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "grid",
    gap: theme.spacing(3),
    margin: theme.spacing(3, 0, 4),
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  },
  section: {
    padding: theme.spacing(2.5),
    borderRadius: theme.spacing(1.5),
    position: "relative",
    minHeight: 200,
    display: "flex",
    flexDirection: "column",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing(1.5),
    gap: theme.spacing(2),
  },
  sectionTitle: {
    fontWeight: 600,
  },
  sectionSubheader: {
    marginTop: -theme.spacing(0.5),
    color: theme.palette.text.secondary,
    fontSize: "0.9rem",
  },
  sectionDivider: {
    margin: theme.spacing(2, 0),
  },
  statGrid: {
    display: "grid",
    gap: theme.spacing(2),
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    marginTop: theme.spacing(2),
  },
  statCard: {
    backgroundColor:
      theme.palette.type === "dark"
        ? theme.palette.background.default
        : theme.palette.grey[100],
    borderRadius: theme.spacing(1),
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
    minHeight: theme.spacing(12),
  },
  statIcon: {
    color: theme.palette.primary.main,
    opacity: 0.85,
  },
  statValue: {
    fontSize: "1.5rem",
    fontWeight: 600,
    lineHeight: 1.1,
  },
  statLabel: {
    fontSize: "0.9rem",
    color: theme.palette.text.secondary,
  },
  loadingContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: theme.spacing(16),
  },
  listRoot: {
    marginTop: theme.spacing(1),
    paddingBottom: 0,
  },
  rankAvatar: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.getContrastText(theme.palette.secondary.main),
    width: theme.spacing(4),
    height: theme.spacing(4),
    fontWeight: 600,
  },
  trendMeta: {
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(1),
    alignItems: "center",
    color: theme.palette.text.secondary,
    fontSize: "0.85rem",
  },
  emptyState: {
    textAlign: "center",
    color: theme.palette.text.secondary,
    padding: theme.spacing(2),
  },
  suggestionBio: {
    marginTop: theme.spacing(0.5),
    color: theme.palette.text.secondary,
    maxWidth: "32ch",
    fontSize: "0.85rem",
    lineHeight: 1.4,
  },
  suggestionStats: {
    marginTop: theme.spacing(0.75),
    display: "flex",
    gap: theme.spacing(1),
    flexWrap: "wrap",
  },
  followButton: {
    minWidth: theme.spacing(11),
  },
  refreshGroup: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(0.5),
  },
  inlineSpinner: {
    marginRight: theme.spacing(1),
  },
  hashtagsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  hashtagChip: {
    fontWeight: 600,
  },
  promptSection: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    backgroundColor:
      theme.palette.type === "dark"
        ? theme.palette.background.default
        : theme.palette.grey[100],
  },
  promptTitle: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    fontWeight: 600,
  },
  promptText: {
    marginTop: theme.spacing(1),
    fontSize: "0.95rem",
    lineHeight: 1.5,
  },
  promptActions: {
    marginTop: theme.spacing(1.5),
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: theme.spacing(1),
  },
  promptLead: {
    color: theme.palette.text.secondary,
  },
  promptButton: {
    textTransform: "none",
  },
  latestPostWrapper: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(0.75),
    marginTop: theme.spacing(0.5),
    flexWrap: "wrap",
  },
  latestPostLink: {
    color: theme.palette.primary.main,
    fontWeight: 600,
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: theme.spacing(0.25),
  },
  latestPostMeta: {
    color: theme.palette.text.secondary,
  },
  spotlightExcerpt: {
    marginTop: theme.spacing(0.5),
    color: theme.palette.text.secondary,
    lineHeight: 1.5,
  },
  spotlightName: {
    fontWeight: 600,
  },
  highlightListPrimary: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    flexWrap: "wrap",
  },
  highlightChips: {
    display: "flex",
    gap: theme.spacing(1),
    flexWrap: "wrap",
  },
  spotlightAvatar: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  momentumGrid: {
    display: "grid",
    gap: theme.spacing(2),
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    marginTop: theme.spacing(2),
  },
  momentumCard: {
    backgroundColor:
      theme.palette.type === "dark"
        ? theme.palette.background.default
        : theme.palette.grey[100],
    borderRadius: theme.spacing(1),
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(0.75),
  },
  momentumMetric: {
    fontSize: "1.6rem",
    fontWeight: 700,
  },
  momentumLabel: {
    fontSize: "0.9rem",
    color: theme.palette.text.secondary,
  },
  momentumHint: {
    fontSize: "0.8rem",
    color: theme.palette.text.secondary,
  },
  scoreChip: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.getContrastText(theme.palette.secondary.main),
    fontWeight: 600,
  },
  progressSection: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
  },
  progressHeadline: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: theme.spacing(1),
  },
  progressInfo: {
    color: theme.palette.text.secondary,
    fontSize: "0.85rem",
  },
  progressBar: {
    height: 8,
    borderRadius: theme.shape.borderRadius,
  },
  subsectionTitle: {
    marginTop: theme.spacing(1),
    fontWeight: 600,
  },
  breakoutList: {
    marginTop: theme.spacing(1),
    paddingBottom: 0,
  },
  breakoutMeta: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    flexWrap: "wrap",
    color: theme.palette.text.secondary,
    fontSize: "0.85rem",
  },
  supporterList: {
    marginTop: theme.spacing(1),
    paddingBottom: 0,
  },
  supporterStats: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    flexWrap: "wrap",
    marginTop: theme.spacing(0.5),
  },
  supporterScore: {
    marginTop: theme.spacing(0.5),
    fontWeight: 600,
    color: theme.palette.primary.main,
  },
  timelineSection: {
    marginTop: theme.spacing(2.5),
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1.5),
  },
  trendRow: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: theme.spacing(1),
  },
  trendLabelGroup: {
    flex: "1 1 140px",
    minWidth: 140,
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(0.5),
  },
  trendLabelPrimary: {
    fontWeight: 600,
  },
  trendBar: {
    flex: "2 1 200px",
    minWidth: 180,
    height: 8,
    borderRadius: theme.shape.borderRadius,
    backgroundColor:
      theme.palette.type === "dark"
        ? theme.palette.grey[800]
        : theme.palette.grey[300],
    overflow: "hidden",
  },
  trendBarFill: {
    height: "100%",
    borderRadius: theme.shape.borderRadius,
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    transition: "width 240ms ease",
  },
  trendMetaDetail: {
    flex: "1 1 220px",
    minWidth: 200,
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(1),
    alignItems: "center",
    justifyContent: "flex-start",
  },
  trendDeltaChip: {
    fontWeight: 600,
  },
  trendDeltaPositive: {
    color: theme.palette.success.main,
    borderColor: theme.palette.success.main,
  },
  trendDeltaNegative: {
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
  },
  trendDeltaNeutral: {
    color: theme.palette.text.secondary,
    borderColor: theme.palette.divider,
  },
  focusList: {
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(1),
  },
  focusChip: {
    fontWeight: 600,
  },
  actionList: {
    display: "grid",
    gap: theme.spacing(1.5),
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  },
  actionCard: {
    borderRadius: theme.spacing(1),
    padding: theme.spacing(2),
    backgroundColor:
      theme.palette.type === "dark"
        ? theme.palette.background.default
        : theme.palette.grey[100],
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
  },
  actionTitle: {
    fontWeight: 600,
  },
  actionDescription: {
    color: theme.palette.text.secondary,
    fontSize: "0.9rem",
    lineHeight: 1.4,
  },
  actionCta: {
    fontSize: "0.8rem",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: theme.palette.primary.main,
    fontWeight: 700,
  },
  achievementGrid: {
    display: "grid",
    gap: theme.spacing(1.5),
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  },
  achievementCard: {
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1.75),
    backgroundColor:
      theme.palette.type === "dark"
        ? theme.palette.background.default
        : theme.palette.grey[100],
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(0.75),
    minHeight: theme.spacing(12),
  },
  achievementHeader: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
  },
  achievementTitle: {
    fontWeight: 600,
  },
  achievementDescription: {
    color: theme.palette.text.secondary,
    fontSize: "0.9rem",
    lineHeight: 1.4,
  },
  achievementStatus: {
    fontSize: "0.75rem",
    letterSpacing: 1,
    textTransform: "uppercase",
    fontWeight: 700,
  },
  achievementUnlocked: {
    borderLeft: `4px solid ${theme.palette.success.main}`,
  },
  achievementLocked: {
    borderLeft: `4px solid ${theme.palette.divider}`,
  },
  achievementIconUnlocked: {
    color: theme.palette.success.main,
  },
  achievementIconLocked: {
    color: theme.palette.text.disabled,
  },
  achievementEmpty: {
    color: theme.palette.text.secondary,
    fontSize: "0.9rem",
  },
  challengeList: {
    display: "grid",
    gap: theme.spacing(2),
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  },
  challengeCard: {
    borderRadius: theme.spacing(1),
    padding: theme.spacing(2),
    backgroundColor:
      theme.palette.type === "dark"
        ? theme.palette.background.default
        : theme.palette.grey[100],
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
  },
  challengeHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: theme.spacing(1),
  },
  challengeHashtag: {
    fontWeight: 600,
  },
  challengeStatus: {
    fontWeight: 600,
  },
  challengeStatusActive: {
    color: theme.palette.success.main,
    borderColor: theme.palette.success.main,
  },
  challengeStatusDormant: {
    color: theme.palette.text.secondary,
    borderColor: theme.palette.divider,
  },
  challengeTitle: {
    fontWeight: 600,
  },
  challengeDescription: {
    color: theme.palette.text.secondary,
    fontSize: "0.9rem",
    lineHeight: 1.45,
  },
  challengeMeta: {
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(1),
  },
  challengeMetaItem: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(0.5),
    color: theme.palette.text.secondary,
    fontSize: "0.8rem",
  },
  challengeFooter: {
    marginTop: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(0.75),
  },
  challengeStats: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: theme.spacing(1.25),
  },
  challengePostTitle: {
    fontWeight: 600,
  },
  challengeLink: {
    alignSelf: "flex-start",
    textTransform: "none",
  },
}));

const numberFormatter = new Intl.NumberFormat();
const percentFormatter = new Intl.NumberFormat(undefined, {
  style: "percent",
  maximumFractionDigits: 0,
});
const shortDateFormatter = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
});

const formatNumber = (value) =>
  value === null || value === undefined ? "0" : numberFormatter.format(value);

const formatDecimal = (value, fractionDigits = 1) => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "0.0";
  }

  return Number(value).toLocaleString(undefined, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
};

const formatPercent = (value) => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "0%";
  }

  const safeValue = Math.max(0, Math.min(Number(value), 1));
  return percentFormatter.format(safeValue);
};

const formatShortDate = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return shortDateFormatter.format(date);
};

const formatRelativeToNow = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const diffMs = Date.now() - date.getTime();
  if (diffMs < 0) {
    return "just now";
  }

  const diffSeconds = Math.floor(diffMs / 1000);
  if (diffSeconds < 60) {
    return "just now";
  }

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) {
    return "yesterday";
  }
  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 5) {
    return `${diffWeeks} week${diffWeeks === 1 ? "" : "s"} ago`;
  }

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) {
    return `${diffMonths} month${diffMonths === 1 ? "" : "s"} ago`;
  }

  const diffYears = Math.floor(diffDays / 365);
  return `${diffYears} year${diffYears === 1 ? "" : "s"} ago`;
};

const truncate = (value, length = 110) => {
  if (!value) {
    return "";
  }
  if (value.length <= length) {
    return value;
  }
  return `${value.substring(0, length - 1)}…`;
};

const PROMPT_LIBRARY = [
  "Share a behind-the-scenes moment from building your latest project.",
  "Celebrate a teammate or community member who helped you this week.",
  "What problem are you solving right now? Let others weigh in with ideas.",
  "Drop a quick win you’re proud of and the lesson you learned.",
  "Give us a tour of your workspace or creative setup today.",
  "Ask the community for feedback on a draft, mockup, or concept.",
  "Reveal a favorite shortcut, tool, or workflow hack you can’t live without.",
  "Tell us about an inspiring article, podcast, or resource you found.",
  "What’s a challenge you want collaborators for? Invite them to join in.",
  "Show us how you recharge when you’re away from the keyboard.",
];

const HomeHighlights = ({
  insights,
  trendingPosts,
  trendingHashtags,
  creatorSpotlight,
  suggestedUsers,
  communityChallenges,
  personalMomentum,
  onRefresh,
  loading,
  refreshing,
}) => {
  const classes = useStyles();
  const [pendingFollowId, setPendingFollowId] = useState(null);
  const [promptIndex, setPromptIndex] = useState(() =>
    PROMPT_LIBRARY.length ? Math.floor(Math.random() * PROMPT_LIBRARY.length) : 0
  );
  const prompt = PROMPT_LIBRARY[promptIndex] || "";
  const [followUser] = useMutation(FOLLOW);

  const topTrending = useMemo(() => trendingPosts.slice(0, 5), [trendingPosts]);
  const topCreators = useMemo(() => suggestedUsers.slice(0, 5), [suggestedUsers]);
  const spotlightCreators = useMemo(
    () => creatorSpotlight.slice(0, 4),
    [creatorSpotlight]
  );
  const hashtagHighlights = useMemo(
    () => trendingHashtags.slice(0, 8),
    [trendingHashtags]
  );

  const stats = useMemo(
    () => [
      {
        label: "Community",
        value: formatNumber(insights?.totalUsers || 0),
        subLabel: `${formatNumber(insights?.activeThisWeek || 0)} active this week (${formatPercent(
          insights?.activePercentage || 0
        )})`,
        icon: <PeopleAltIcon className={classes.statIcon} />,
      },
      {
        label: "Stories shared",
        value: formatNumber(insights?.totalPosts || 0),
        subLabel: `${formatNumber(insights?.postsToday || 0)} today • ${formatDecimal(
          insights?.averageCommentsPerPost || 0,
          1
        )} comments/post`,
        icon: <PostAddIcon className={classes.statIcon} />,
      },
      {
        label: "Reactions",
        value: formatNumber(insights?.totalLikes || 0),
        subLabel: `${formatNumber(insights?.totalComments || 0)} comments • ${formatDecimal(
          insights?.averageLikesPerPost || 0,
          1
        )} likes/post`,
        icon: <FavoriteIcon className={classes.statIcon} />,
      },
      {
        label: "Fresh faces",
        value: formatNumber(insights?.newUsersThisWeek || 0),
        subLabel: "joined this week",
        icon: <EmojiEventsIcon className={classes.statIcon} />,
      },
      {
        label: "Engagement",
        value: formatDecimal(insights?.engagementRate || 0, 1),
        subLabel: "avg interactions per story",
        icon: <TrendingUpIcon className={classes.statIcon} />,
      },
      {
        label: "Participation",
        value: formatPercent(insights?.activePercentage || 0),
        subLabel: "members checked in this week",
        icon: <GroupWorkIcon className={classes.statIcon} />,
      },
    ],
    [insights, classes.statIcon]
  );

  const momentum = personalMomentum || null;
  const breakoutPosts = useMemo(
    () => (momentum?.breakoutPosts || []).slice(0, 3),
    [momentum]
  );
  const supporters = useMemo(
    () =>
      (momentum?.supporterSpotlight || []).filter(
        (spotlight) => spotlight && spotlight.user
      ),
    [momentum]
  );
  const milestone = momentum?.milestone || null;
  const milestoneProgress = Math.round((milestone?.progressRatio || 0) * 100);
  const milestoneProgressValue = Math.max(
    0,
    Math.min(100, milestoneProgress)
  );
  const highlightCopy =
    momentum?.highlight ||
    "Share today to unlock a personalized creative momentum report.";
  const momentumScore = Math.round(momentum?.momentumScore || 0);
  const momentumStats = useMemo(() => {
    const lastPostRelative = formatRelativeToNow(
      momentum?.lastPostCreatedAt
    );
    const postsLastMonth = formatNumber(momentum?.postsLastMonth || 0);
    const interactionTotal =
      (momentum?.likesOnRecentPosts || 0) +
      (momentum?.commentsLastWeek || 0);
    const supporterCount = formatNumber(momentum?.supporterTotal || 0);
    const commentCount = formatNumber(momentum?.commentsLastWeek || 0);
    const likeCount = formatNumber(momentum?.likesOnRecentPosts || 0);

    return [
      {
        label: "Posting streak",
        value:
          momentum?.postingStreak && momentum.postingStreak > 0
            ? `${momentum.postingStreak} day${
                momentum.postingStreak === 1 ? "" : "s"
              }`
            : "Start a streak",
        hint: lastPostRelative
          ? `Last posted ${lastPostRelative}`
          : "Share a story to light the first spark.",
        icon: <FlashOnIcon className={classes.statIcon} />,
      },
      {
        label: "Posts this week",
        value: formatNumber(momentum?.postsLastWeek || 0),
        hint: `${postsLastMonth} in the last 30 days`,
        icon: <BarChartIcon className={classes.statIcon} />,
      },
      {
        label: "Recent cheers",
        value: formatNumber(interactionTotal),
        hint: `${supporterCount} supporters • ${commentCount} comments • ${likeCount} likes`,
        icon: <EmojiPeopleIcon className={classes.statIcon} />,
      },
    ];
  }, [momentum, classes.statIcon]);

  const focusHighlights = useMemo(() => {
    const focusList = (momentum?.focusHashtags || []).filter(
      (focus) => focus && focus.tag
    );

    return focusList.slice(0, 6).map((focus) => {
      const rawTag = focus.tag || "";
      const tagValue = rawTag.startsWith("#") ? rawTag : `#${rawTag}`;
      const useCount = focus.useCount || 0;
      const formattedCount = formatNumber(useCount);
      const relative = formatRelativeToNow(focus.lastUsedAt);
      const shortDate = formatShortDate(focus.lastUsedAt);
      const recency = relative || (shortDate ? `on ${shortDate}` : "recently");

      return {
        key: `${tagValue}-${focus.lastUsedPostId || "focus"}`,
        tag: tagValue,
        useCount,
        formattedCount,
        lastUsedPostId: focus.lastUsedPostId,
        tooltip: `Used ${formattedCount} times • last shared ${recency}`,
      };
    });
  }, [momentum]);

  const timelineSeries = useMemo(() => {
    const entries = (momentum?.trend || []).filter((entry) => entry);
    if (!entries.length) {
      return [];
    }

    const totals = entries.map((entry) => {
      const likes = entry.likes || 0;
      const comments = entry.comments || 0;
      const interactions = entry.interactions ?? likes + comments;
      return Math.max(interactions || 0, 0);
    });

    const maxInteractions = Math.max(...totals, 1);

    return entries.map((entry) => {
      const posts = entry.posts || 0;
      const likes = entry.likes || 0;
      const comments = entry.comments || 0;
      const interactions = entry.interactions ?? likes + comments;
      const safeInteractions = Math.max(interactions || 0, 0);
      const widthRaw = Math.round((safeInteractions / maxInteractions) * 100);
      const width = safeInteractions <= 0 ? 8 : Math.min(100, Math.max(widthRaw, 16));
      const label = entry.label || "This week";

      return {
        key: `${label}-${posts}-${comments}-${likes}`,
        label,
        posts,
        comments,
        likes,
        interactions: safeInteractions,
        formatted: {
          posts: formatNumber(posts),
          comments: formatNumber(comments),
          likes: formatNumber(likes),
          interactions: formatNumber(safeInteractions),
        },
        delta: entry.momentumDelta ?? 0,
        width,
      };
    });
  }, [momentum]);

  const nextMoves = useMemo(() => {
    return (momentum?.nextActions || [])
      .filter(
        (action) => action && action.title && action.description
      )
      .slice(0, 4)
      .map((action) => ({
        title: action.title,
        description: action.description,
        actionText: action.actionText,
      }));
  }, [momentum]);

  const momentumAchievements = useMemo(() => {
    const entries = (momentum?.achievements || [])
      .filter((achievement) => achievement && achievement.title && achievement.description)
      .map((achievement) => {
        const earned = Boolean(achievement.earned);
        const earnedAt = achievement.earnedAt;
        const relative = formatRelativeToNow(earnedAt);
        const shortDate = formatShortDate(earnedAt);
        let statusText = earned ? "Unlocked" : "Locked — keep creating";

        if (earned) {
          if (relative) {
            statusText = `Unlocked ${relative}`;
          } else if (shortDate) {
            statusText = `Unlocked on ${shortDate}`;
          }
        }

        return {
          key: `${achievement.title}-${achievement.description}`,
          title: achievement.title,
          description: achievement.description,
          earned,
          statusText,
        };
      });

    return entries.sort((a, b) => Number(b.earned) - Number(a.earned));
  }, [momentum]);

  const challengeHighlights = useMemo(() => {
    return (communityChallenges || [])
      .filter((challenge) => challenge && (challenge.title || challenge.hashtag))
      .slice(0, 4)
      .map((challenge) => {
        const participants = formatNumber(challenge.participants || 0);
        const boostValue =
          typeof challenge.momentumBoost === "number"
            ? Math.max(0, Math.min(challenge.momentumBoost, 1))
            : null;
        const boostLabel =
          boostValue !== null ? `${formatPercent(boostValue)} of recent buzz` : null;
        const sample = challenge.samplePost || null;
        const relative = sample ? formatRelativeToNow(sample.createdAt) : null;
        const shortDate = sample ? formatShortDate(sample.createdAt) : null;
        const latestShared = relative || (shortDate ? `on ${shortDate}` : null);

        return {
          id: challenge.id || challenge.hashtag || challenge.title,
          title: challenge.title || challenge.hashtag || "Community challenge",
          description:
            challenge.description ||
            `Join ${participants} creators rallying around ${challenge.hashtag || "this theme"}.`,
          hashtag: challenge.hashtag,
          participants,
          momentumBoostLabel: boostLabel,
          duration: challenge.duration,
          isActive: Boolean(challenge.isActive),
          samplePost: sample
            ? {
                id: sample.id,
                title: sample.title,
                likeCount: sample.likeCount || 0,
                commentCount: sample.commentCount || 0,
                userName: sample.user?.username,
                latestShared,
              }
            : null,
        };
      });
  }, [communityChallenges]);

  const hasMomentumEnhancements =
    timelineSeries.length > 0 ||
    focusHighlights.length > 0 ||
    nextMoves.length > 0 ||
    momentumAchievements.length > 0;

  const handleFollow = (user) => {
    if (!user) {
      return;
    }

    setPendingFollowId(user.id);
    followUser({
      variables: { id: user.id },
      update: (cache, { data }) => {
        const responseUser = data?.followUser?.user;
        if (!responseUser) {
          return;
        }

        cache.writeFragment({
          id: cache.identify({ __typename: "UserNode", id: responseUser.id }),
          fragment: gql`
            fragment FollowSuggestion on UserNode {
              followerCount
              isFollowing
            }
          `,
          data: {
            followerCount: responseUser.followerCount,
            isFollowing: responseUser.isFollowing,
          },
        });
      },
    }).finally(() => setPendingFollowId(null));
  };

  const handleShufflePrompt = useCallback(() => {
    if (PROMPT_LIBRARY.length <= 1) {
      return;
    }

    let nextIndex = Math.floor(Math.random() * PROMPT_LIBRARY.length);
    if (nextIndex === promptIndex) {
      nextIndex = (nextIndex + 1) % PROMPT_LIBRARY.length;
    }

    setPromptIndex(nextIndex);
  }, [promptIndex]);

  const isLoading = loading && !trendingPosts.length && !suggestedUsers.length;
  const spotlightLoading = loading && !spotlightCreators.length;
  const hashtagsLoading = loading && !hashtagHighlights.length;

  return (
    <div className={classes.container}>
      <Paper elevation={0} className={classes.section}>
        <div className={classes.sectionHeader}>
          <div>
            <Typography variant="h6" className={classes.sectionTitle}>
              Today's snapshot
            </Typography>
          </div>
          <div className={classes.refreshGroup}>
            {refreshing && <CircularProgress size={18} className={classes.inlineSpinner} />}
            {onRefresh && (
              <Tooltip title="Refresh highlights">
                <span>
                  <IconButton size="small" onClick={onRefresh} disabled={refreshing}>
                    <RefreshIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            )}
          </div>
        </div>
        {isLoading ? (
          <div className={classes.loadingContainer}>
            <CircularProgress size={32} />
          </div>
        ) : (
          <div className={classes.statGrid}>
            {stats.map((stat) => (
              <div key={stat.label} className={classes.statCard}>
                {stat.icon}
                <Typography className={classes.statValue}>{stat.value}</Typography>
                <Typography className={classes.statLabel}>{stat.label}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {stat.subLabel}
                </Typography>
              </div>
            ))}
          </div>
        )}
      </Paper>

      <Paper elevation={0} className={classes.section}>
        <div className={classes.sectionHeader}>
          <div>
            <Typography variant="h6" className={classes.sectionTitle}>
              Your creative momentum
            </Typography>
            <Typography variant="body2" className={classes.sectionSubheader}>
              {highlightCopy}
            </Typography>
          </div>
          {momentum && (
            <Chip
              icon={<TrendingUpIcon style={{ fontSize: "1rem", color: "inherit" }} />}
              label={`Momentum ${momentumScore}`}
              className={classes.scoreChip}
            />
          )}
        </div>
        {!momentum ? (
          <div className={classes.emptyState}>
            <Typography variant="body2">
              Share your next idea to unlock personalized momentum insights tailored to you.
            </Typography>
          </div>
        ) : (
          <>
            <div className={classes.momentumGrid}>
              {momentumStats.map((stat) => (
                <div key={stat.label} className={classes.momentumCard}>
                  {stat.icon}
                  <Typography className={classes.momentumMetric}>{stat.value}</Typography>
                  <Typography className={classes.momentumLabel}>{stat.label}</Typography>
                  <Typography variant="caption" className={classes.momentumHint}>
                    {stat.hint}
                  </Typography>
                </div>
              ))}
            </div>
            {milestone && (
              <div className={classes.progressSection}>
                <div className={classes.progressHeadline}>
                  <Typography variant="subtitle1">Next milestone</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {milestone.achieved
                      ? "Milestone achieved!"
                      : `${formatNumber(milestone.remaining || 0)} to go`}
                  </Typography>
                </div>
                <LinearProgress
                  variant="determinate"
                  value={milestoneProgressValue}
                  className={classes.progressBar}
                />
                <Typography variant="caption" className={classes.progressInfo}>
                  {milestone.achieved
                    ? "Time to dream up a bolder milestone."
                    : "Keep sharing to cross this milestone even faster."}
                </Typography>
              </div>
            )}
            {hasMomentumEnhancements && (
              <Divider className={classes.sectionDivider} />
            )}
            {timelineSeries.length > 0 && (
              <div className={classes.timelineSection}>
                <Typography variant="subtitle2" className={classes.subsectionTitle}>
                  Momentum timeline
                </Typography>
                {timelineSeries.map((point) => {
                  const delta = point.delta;
                  const deltaLabel =
                    delta > 0
                      ? `+${formatNumber(delta)} vs prior`
                      : delta < 0
                      ? `-${formatNumber(Math.abs(delta))} vs prior`
                      : "Holding steady";
                  const deltaClass =
                    delta > 0
                      ? classes.trendDeltaPositive
                      : delta < 0
                      ? classes.trendDeltaNegative
                      : classes.trendDeltaNeutral;

                  return (
                    <div key={point.key} className={classes.trendRow}>
                      <div className={classes.trendLabelGroup}>
                        <Typography variant="body2" className={classes.trendLabelPrimary}>
                          {point.label}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {`${point.formatted.posts} post${point.posts === 1 ? "" : "s"}`}
                        </Typography>
                      </div>
                      <div className={classes.trendBar}>
                        <div
                          className={classes.trendBarFill}
                          style={{ width: `${point.width}%` }}
                        />
                      </div>
                      <div className={classes.trendMetaDetail}>
                        <Chip
                          size="small"
                          icon={<ForumIcon style={{ fontSize: "1rem" }} />}
                          label={`${point.formatted.comments} comments`}
                        />
                        <Chip
                          size="small"
                          icon={<FavoriteIcon style={{ fontSize: "1rem" }} />}
                          label={`${point.formatted.likes} likes`}
                        />
                        <Chip
                          size="small"
                          icon={<WhatshotIcon style={{ fontSize: "1rem" }} />}
                          label={`${point.formatted.interactions} interactions`}
                        />
                        <Chip
                          size="small"
                          variant="outlined"
                          icon={
                            delta > 0 ? (
                              <TrendingUpIcon style={{ fontSize: "1rem" }} />
                            ) : delta < 0 ? (
                              <TrendingDownIcon style={{ fontSize: "1rem" }} />
                            ) : (
                              <TrendingFlatIcon style={{ fontSize: "1rem" }} />
                            )
                          }
                          label={deltaLabel}
                          className={clsx(classes.trendDeltaChip, deltaClass)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {focusHighlights.length > 0 && (
              <div className={classes.timelineSection}>
                <Typography variant="subtitle2" className={classes.subsectionTitle}>
                  Creative focus
                </Typography>
                <div className={classes.focusList}>
                  {focusHighlights.map((focus) => {
                    const chipProps = focus.lastUsedPostId
                      ? {
                          component: Link,
                          to: `/post/${focus.lastUsedPostId}`,
                          clickable: true,
                        }
                      : {};

                    return (
                      <Tooltip key={focus.key} title={focus.tooltip} arrow>
                        <Chip
                          icon={<LocalOfferIcon style={{ fontSize: "1rem" }} />}
                          label={`${focus.tag} • ${focus.formattedCount} uses`}
                          className={classes.focusChip}
                          {...chipProps}
                        />
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            )}
            {nextMoves.length > 0 && (
              <div className={classes.timelineSection}>
                <Typography variant="subtitle2" className={classes.subsectionTitle}>
                  Next best moves
                </Typography>
                <div className={classes.actionList}>
                  {nextMoves.map((action) => (
                    <div key={action.title} className={classes.actionCard}>
                      <Typography variant="subtitle1" className={classes.actionTitle}>
                        {action.title}
                      </Typography>
                      <Typography variant="body2" className={classes.actionDescription}>
                        {action.description}
                      </Typography>
                      {action.actionText && (
                        <Typography variant="button" className={classes.actionCta}>
                          {action.actionText}
                        </Typography>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className={classes.timelineSection}>
              <Typography variant="subtitle2" className={classes.subsectionTitle}>
                Momentum achievements
              </Typography>
              {momentumAchievements.length ? (
                <div className={classes.achievementGrid}>
                  {momentumAchievements.map((achievement) => (
                    <div
                      key={achievement.key}
                      className={clsx(
                        classes.achievementCard,
                        achievement.earned
                          ? classes.achievementUnlocked
                          : classes.achievementLocked
                      )}
                    >
                      <div className={classes.achievementHeader}>
                        {achievement.earned ? (
                          <CheckCircleIcon
                            fontSize="small"
                            className={classes.achievementIconUnlocked}
                          />
                        ) : (
                          <LockOutlinedIcon
                            fontSize="small"
                            className={classes.achievementIconLocked}
                          />
                        )}
                        <Typography variant="subtitle1" className={classes.achievementTitle}>
                          {achievement.title}
                        </Typography>
                      </div>
                      <Typography variant="body2" className={classes.achievementDescription}>
                        {achievement.description}
                      </Typography>
                      <Typography
                        variant="caption"
                        className={classes.achievementStatus}
                        color={achievement.earned ? "primary" : "textSecondary"}
                      >
                        {achievement.statusText}
                      </Typography>
                    </div>
                  ))}
                </div>
              ) : (
                <Typography variant="body2" className={classes.achievementEmpty}>
                  Unlock your first badge by sharing consistently throughout the week.
                </Typography>
              )}
            </div>
          </>
        )}
      </Paper>

      <Paper elevation={0} className={classes.section}>
        <div className={classes.sectionHeader}>
          <div>
            <Typography variant="h6" className={classes.sectionTitle}>
              Community challenges
            </Typography>
            <Typography variant="body2" className={classes.sectionSubheader}>
              Join collaborative themes creators are rallying around right now.
            </Typography>
          </div>
        </div>
        {loading && !challengeHighlights.length ? (
          <div className={classes.loadingContainer}>
            <CircularProgress size={32} />
          </div>
        ) : challengeHighlights.length ? (
          <div className={classes.challengeList}>
            {challengeHighlights.map((challenge) => (
              <div key={challenge.id} className={classes.challengeCard}>
                <div className={classes.challengeHeader}>
                  <Chip
                    icon={<FlagIcon style={{ fontSize: "1rem" }} />}
                    label={challenge.hashtag || challenge.title}
                    className={classes.challengeHashtag}
                    color="primary"
                  />
                  <Chip
                    size="small"
                    variant="outlined"
                    label={challenge.isActive ? "Active now" : "Heating up"}
                    className={clsx(
                      classes.challengeStatus,
                      challenge.isActive
                        ? classes.challengeStatusActive
                        : classes.challengeStatusDormant
                    )}
                  />
                </div>
                <Typography variant="subtitle1" className={classes.challengeTitle}>
                  {challenge.title}
                </Typography>
                <Typography variant="body2" className={classes.challengeDescription}>
                  {challenge.description}
                </Typography>
                <div className={classes.challengeMeta}>
                  <Chip
                    size="small"
                    icon={<EmojiPeopleIcon style={{ fontSize: "1rem" }} />}
                    label={`${challenge.participants} creators`}
                  />
                  {challenge.momentumBoostLabel && (
                    <Chip
                      size="small"
                      icon={<TrendingUpIcon style={{ fontSize: "1rem" }} />}
                      label={`Momentum ${challenge.momentumBoostLabel}`}
                    />
                  )}
                  {challenge.duration && (
                    <Chip
                      size="small"
                      icon={<TimerIcon style={{ fontSize: "1rem" }} />}
                      label={challenge.duration}
                    />
                  )}
                </div>
                {challenge.samplePost && (
                  <div className={classes.challengeFooter}>
                    <Typography variant="body2" className={classes.challengePostTitle}>
                      Latest from {challenge.samplePost.userName || "the community"}
                    </Typography>
                    <div className={classes.challengeStats}>
                      {challenge.samplePost.latestShared && (
                        <Typography variant="caption" color="textSecondary">
                          Shared {challenge.samplePost.latestShared}
                        </Typography>
                      )}
                      <div className={classes.challengeMetaItem}>
                        <FavoriteIcon style={{ fontSize: "1rem" }} />
                        {formatNumber(challenge.samplePost.likeCount)}
                      </div>
                      <div className={classes.challengeMetaItem}>
                        <ForumIcon style={{ fontSize: "1rem" }} />
                        {formatNumber(challenge.samplePost.commentCount)}
                      </div>
                    </div>
                    <Button
                      size="small"
                      color="primary"
                      component={Link}
                      to={`/post/${challenge.samplePost.id}`}
                      className={classes.challengeLink}
                      endIcon={<LaunchIcon fontSize="small" />}
                    >
                      View post
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className={classes.emptyState}>
            <Typography variant="body2">
              Start a challenge with your next hashtag to see it light up here.
            </Typography>
          </div>
        )}
      </Paper>

      <Paper elevation={0} className={classes.section}>
        <div className={classes.sectionHeader}>
          <div>
            <Typography variant="h6" className={classes.sectionTitle}>
              Breakout creations
            </Typography>
            <Typography variant="body2" className={classes.sectionSubheader}>
              {momentum
                ? "The stories sparking the loudest cheers lately."
                : "Your breakout board will appear after you share."}
            </Typography>
          </div>
        </div>
        {momentum ? (
          <>
            <Typography variant="subtitle2" className={classes.subsectionTitle}>
              Top performance
            </Typography>
            <List className={classes.breakoutList} dense>
              {breakoutPosts.map((post, index) => (
                <React.Fragment key={post.id}>
                  <ListItem
                    alignItems="flex-start"
                    button
                    component={Link}
                    to={`/post/${post.id}`}
                  >
                    <ListItemText
                      primary={post.title}
                      secondary={
                        <span className={classes.breakoutMeta}>
                          <span>{formatShortDate(post.createdAt) || "Recently"}</span>
                          <span>
                            <FavoriteIcon fontSize="small" style={{ fontSize: "0.95rem" }} />
                            {formatNumber(post.likeCount)}
                          </span>
                          <span>
                            <ForumIcon fontSize="small" style={{ fontSize: "0.95rem" }} />
                            {formatNumber(post.commentCount)}
                          </span>
                        </span>
                      }
                    />
                  </ListItem>
                  {index < breakoutPosts.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
              {!breakoutPosts.length && (
                <div className={classes.emptyState}>
                  <Typography variant="body2">
                    Share something new to spotlight your next breakout post.
                  </Typography>
                </div>
              )}
            </List>
            <Divider className={classes.sectionDivider} />
            <Typography variant="subtitle2" className={classes.subsectionTitle}>
              Supporter spotlight
            </Typography>
            <List className={classes.supporterList} dense>
              {supporters.map((supporter, index) => (
                <React.Fragment key={supporter.user.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar
                        src={supporter.user.imagePath || undefined}
                        alt={supporter.user.username}
                      >
                        {supporter.user.username.substring(0, 1).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={supporter.user.username}
                      secondary={
                        <>
                          <div className={classes.supporterStats}>
                            <Chip
                              size="small"
                              icon={<ForumIcon style={{ fontSize: "1rem" }} />}
                              label={`${formatNumber(supporter.commentCount || 0)} comments`}
                            />
                            <Chip
                              size="small"
                              icon={<FavoriteIcon style={{ fontSize: "1rem" }} />}
                              label={`${formatNumber(supporter.likeCount || 0)} likes`}
                            />
                          </div>
                          <Typography variant="caption" className={classes.supporterScore}>
                            Cheer score {formatNumber(supporter.cheerScore || 0)}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {index < supporters.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
              {!supporters.length && (
                <div className={classes.emptyState}>
                  <Typography variant="body2">
                    Rally your crew—every comment and like will show up here.
                  </Typography>
                </div>
              )}
            </List>
          </>
        ) : (
          <div className={classes.emptyState}>
            <Typography variant="body2">
              Your breakout board and cheer squad will appear after your next post.
            </Typography>
          </div>
        )}
      </Paper>

      <Paper elevation={0} className={classes.section}>
        <div className={classes.sectionHeader}>
          <div>
            <Typography variant="h6" className={classes.sectionTitle}>
              Creator spotlight
            </Typography>
            <Typography variant="body2" className={classes.sectionSubheader}>
              Fresh voices gaining momentum this month.
            </Typography>
          </div>
        </div>
        {spotlightLoading ? (
          <div className={classes.loadingContainer}>
            <CircularProgress size={32} />
          </div>
        ) : (
          <List className={classes.listRoot} dense>
            {spotlightCreators.map((spotlight, index) => (
              <React.Fragment key={spotlight.user.id}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar
                      src={spotlight.user.imagePath || undefined}
                      alt={spotlight.user.username}
                      className={classes.spotlightAvatar}
                    >
                      {spotlight.user.username.substring(0, 1).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <div className={classes.highlightListPrimary}>
                        <Typography variant="subtitle1" className={classes.spotlightName}>
                          {spotlight.user.username}
                        </Typography>
                        <div className={classes.highlightChips}>
                          <Chip
                            size="small"
                            icon={<PostAddIcon style={{ fontSize: "1rem" }} />}
                            label={`${formatNumber(spotlight.postsThisWeek || 0)} recent posts`}
                          />
                          <Chip
                            size="small"
                            icon={<FavoriteIcon style={{ fontSize: "1rem" }} />}
                            label={`${formatNumber(spotlight.recentLikeCount || 0)} recent likes`}
                          />
                          <Chip
                            size="small"
                            icon={<PeopleAltIcon style={{ fontSize: "1rem" }} />}
                            label={`${formatNumber(spotlight.user.followerCount || 0)} supporters`}
                          />
                        </div>
                      </div>
                    }
                    secondary={
                      <>
                        {spotlight.latestPostTitle && (
                          <div className={classes.latestPostWrapper}>
                            <LaunchIcon style={{ fontSize: "1rem" }} />
                            <Link
                              to={`/post/${spotlight.latestPostId}`}
                              className={classes.latestPostLink}
                            >
                              {spotlight.latestPostTitle}
                            </Link>
                            {formatShortDate(spotlight.latestPostCreatedAt) && (
                              <Typography
                                variant="caption"
                                className={classes.latestPostMeta}
                              >
                                {formatShortDate(spotlight.latestPostCreatedAt)}
                              </Typography>
                            )}
                          </div>
                        )}
                        <Typography variant="body2" className={classes.spotlightExcerpt}>
                          {spotlight.latestPostExcerpt ||
                            truncate(spotlight.user.bio, 100) ||
                            "They're just getting started — go cheer them on!"}
                        </Typography>
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Button
                      variant={spotlight.user.isFollowing ? "outlined" : "contained"}
                      color="primary"
                      size="small"
                      className={classes.followButton}
                      onClick={() => handleFollow(spotlight.user)}
                      disabled={pendingFollowId === spotlight.user.id}
                    >
                      {pendingFollowId === spotlight.user.id ? (
                        <CircularProgress size={18} />
                      ) : spotlight.user.isFollowing ? (
                        "Following"
                      ) : (
                        "Follow"
                      )}
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < spotlightCreators.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
            {!spotlightCreators.length && (
              <div className={classes.emptyState}>
                <Typography variant="body2">
                  Share something new today and you could land in the spotlight tomorrow.
                </Typography>
              </div>
            )}
          </List>
        )}
      </Paper>

      <Paper elevation={0} className={classes.section}>
        <div className={classes.sectionHeader}>
          <Typography variant="h6" className={classes.sectionTitle}>
            Trending conversations
          </Typography>
        </div>
        {loading && !topTrending.length ? (
          <div className={classes.loadingContainer}>
            <CircularProgress size={32} />
          </div>
        ) : (
          <List className={classes.listRoot} dense>
            {topTrending.map((post, index) => (
              <React.Fragment key={post.id}>
                <ListItem
                  alignItems="flex-start"
                  button
                  component={Link}
                  to={`/post/${post.id}`}
                >
                  <ListItemAvatar>
                    <Avatar className={classes.rankAvatar}>{index + 1}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={post.title}
                    secondary={
                      <span className={classes.trendMeta}>
                        <span>by {post.user.username}</span>
                        <span>
                          <FavoriteIcon fontSize="small" style={{ fontSize: "0.95rem" }} />
                          {formatNumber(post.likeCount)}
                        </span>
                        <span>
                          <ForumIcon fontSize="small" style={{ fontSize: "0.95rem" }} />
                          {formatNumber(post.commentCount)}
                        </span>
                      </span>
                    }
                  />
                </ListItem>
                {index < topTrending.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
            {!trendingPosts.length && (
              <div className={classes.emptyState}>
                <WhatshotIcon color="disabled" />
                <Typography variant="body2">
                  Start the conversation – share a post and make it trend!
                </Typography>
              </div>
            )}
          </List>
        )}
      </Paper>

      <Paper elevation={0} className={classes.section}>
        <div className={classes.sectionHeader}>
          <div>
            <Typography variant="h6" className={classes.sectionTitle}>
              Community themes
            </Typography>
            <Typography variant="body2" className={classes.sectionSubheader}>
              Hashtags buzzing across the community right now.
            </Typography>
          </div>
        </div>
        {hashtagsLoading ? (
          <div className={classes.loadingContainer}>
            <CircularProgress size={32} />
          </div>
        ) : (
          <>
            <div className={classes.hashtagsContainer}>
              {hashtagHighlights.map((hashtag) => (
                <Tooltip
                  key={hashtag.tag}
                  title={`${formatNumber(hashtag.mentionCount)} mentions across ${formatNumber(
                    hashtag.postCount
                  )} posts`}
                  arrow
                >
                  <Chip
                    icon={<LocalOfferIcon style={{ fontSize: "1rem" }} />}
                    label={hashtag.tag}
                    className={classes.hashtagChip}
                    variant="outlined"
                  />
                </Tooltip>
              ))}
            </div>
            {!hashtagHighlights.length && (
              <div className={classes.emptyState}>
                <LocalOfferIcon color="disabled" />
                <Typography variant="body2">
                  No hashtags are trending yet. Launch one with your next update!
                </Typography>
              </div>
            )}
          </>
        )}
        <Divider className={classes.sectionDivider} />
        <div className={classes.promptSection}>
          <Typography variant="subtitle1" className={classes.promptTitle}>
            <WbIncandescentIcon fontSize="small" /> Spark an idea
          </Typography>
          <Typography variant="body2" className={classes.promptText}>
            {prompt}
          </Typography>
          <div className={classes.promptActions}>
            <Typography variant="caption" className={classes.promptLead}>
              Tip: pair your post with a hashtag to join the themes above.
            </Typography>
            <Button
              size="small"
              color="primary"
              startIcon={<RefreshIcon fontSize="small" />}
              onClick={handleShufflePrompt}
              className={classes.promptButton}
              disabled={PROMPT_LIBRARY.length <= 1}
            >
              Inspire me again
            </Button>
          </div>
        </div>
      </Paper>

      <Paper elevation={0} className={classes.section}>
        <div className={classes.sectionHeader}>
          <Typography variant="h6" className={classes.sectionTitle}>
            Creators to follow
          </Typography>
        </div>
        {loading && !suggestedUsers.length ? (
          <div className={classes.loadingContainer}>
            <CircularProgress size={32} />
          </div>
        ) : (
          <List className={classes.listRoot} dense>
            {topCreators.map((user, index) => (
              <React.Fragment key={user.id}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar src={user.imagePath || undefined} alt={user.username}>
                      {user.username.substring(0, 1).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.username}
                    secondary={
                      <>
                        <Typography component="span" className={classes.suggestionBio}>
                          {truncate(user.bio, 90) || "This creator is still crafting their bio."}
                        </Typography>
                        <div className={classes.suggestionStats}>
                          <Chip
                            size="small"
                            icon={<PostAddIcon style={{ fontSize: "1rem" }} />}
                            label={`${formatNumber(user.postCount)} posts`}
                          />
                          <Chip
                            size="small"
                            icon={<PeopleAltIcon style={{ fontSize: "1rem" }} />}
                            label={`${formatNumber(user.followerCount)} followers`}
                          />
                        </div>
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Button
                      variant={user.isFollowing ? "outlined" : "contained"}
                      color="primary"
                      size="small"
                      className={classes.followButton}
                      onClick={() => handleFollow(user)}
                      disabled={pendingFollowId === user.id}
                    >
                      {pendingFollowId === user.id ? (
                        <CircularProgress size={18} />
                      ) : user.isFollowing ? (
                        "Following"
                      ) : (
                        "Follow"
                      )}
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < topCreators.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
            {!suggestedUsers.length && (
              <div className={classes.emptyState}>
                <Typography variant="body2">
                  You're caught up with everyone! Discover more voices from the feed to refresh this list.
                </Typography>
              </div>
            )}
          </List>
        )}
      </Paper>
    </div>
  );
};

export default HomeHighlights;
