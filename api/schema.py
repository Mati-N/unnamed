import graphene 
from graphene import InputObjectType
import graphql_jwt
from django.contrib.auth import authenticate
from graphql_jwt.decorators import login_required
from graphene_django.filter import DjangoFilterConnectionField
from django_filters import OrderingFilter
from django.db.models import Count, IntegerField
from .schemafiles.Nodes import *
from .schemafiles.mutations import *
from .signals import *
from .models import *
from django.db.models import Q
from graphene_django.types import DjangoObjectType
from graphene_subscriptions.events import CREATED


class Query(object):
    posts = DjangoFilterConnectionField(PostNode, id=graphene.ID(), post_title=graphene.String(), post_text=graphene.String())
    following_posts = DjangoFilterConnectionField(PostNode, id=graphene.ID(), post_title=graphene.String(), post_text=graphene.String())
    self_post = DjangoFilterConnectionField(PostNode, post_title=graphene.String(), post_text=graphene.String())
    user_post = DjangoFilterConnectionField(PostNode, id=graphene.ID(), post_title=graphene.String(), post_text=graphene.String())
    self_user = graphene.Field(UserNode)
    user_get = graphene.Field(UserNode, id=graphene.ID())
    comments = DjangoFilterConnectionField(CommentNode)
    post_comments = DjangoFilterConnectionField(CommentNode, id=graphene.ID())
    is_following = graphene.Boolean(id=graphene.ID())
    liked = graphene.Boolean(id=graphene.ID())
    self_notification = DjangoFilterConnectionField(NotificationNode)
    notification_number = graphene.Int()

    @login_required
    def resolve_notification_number(self, info):
        return Notification.objects.filter(read=False, recipient=info.context.user).distinct().count()
    # Get notifications for currently logged in user
    @login_required
    def resolve_self_notification(self, info, **kwargs):
        return Notification.objects.filter(recipient=info.context.user).distinct()

    def resolve_post_comments(self, info, id, **kwargs):
        return Comment.objects.filter(post=Post.objects.get(id=id))

    def resolve_user_get(self, info, id, **kwargs):
        try:
            return User.objects.get(id=id)
        except User.mode.DoesNotExist:
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

    def reslove_comments(self, info,  **kwargs):
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

class Subscription(graphene.ObjectType):
    notification_created = graphene.Field(NotificationNode)

    def resolve_notification_created(root, info, **kwargs):
        print(root, root.event)
        return root.filter(
            lambda event:
                event.operation == CREATED and
                isinstance(event.instance, Notification) and
                event.instance.recipient == info.context.user
        ).map(lambda event: event.instance)