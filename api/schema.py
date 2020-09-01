import graphene 
from graphene import InputObjectType
import graphql_jwt
from django.contrib.auth import authenticate
from graphql_jwt.decorators import login_required
from graphene_django.filter import DjangoFilterConnectionField
from django_filters import OrderingFilter
from time import sleep
from django.db.models import Count, IntegerField
from django.conf import settings
from schemafiles.Nodes import *
from schemafiles.mutations import *

from models import *



class Query(object):
    users = DjangoFilterConnectionField(UserNode, id=graphene.ID(), user_name=graphene.String())
    posts = DjangoFilterConnectionField(PostNode, id=graphene.ID(), post_title=graphene.String(), post_text=graphene.String())
    following_posts = DjangoFilterConnectionField(PostNode, id=graphene.ID(), post_title=graphene.String(), post_text=graphene.String())
    post = DjangoFilterConnectionField(PostNode, post_title=graphene.String(), post_text=graphene.String())
    user_post = DjangoFilterConnectionField(PostNode, id=graphene.ID(), post_title=graphene.String(), post_text=graphene.String())
    user = graphene.relay.Node.Field(UserNode)
    user_get = graphene.relay.Node.Field(UserNode, id=graphene.ID())
    comments = DjangoFilterConnectionField(CommentNode)
    post_comments = DjangoFilterConnectionField(CommentNode, id=graphene.ID())
    is_following = graphene.Boolean(id=graphene.ID())
    liked = graphene.Boolean(id=graphene.ID())


    def resolve_post_comments(self, info, id, **kwargs):
        return Comment.objects.filter(post=Post.objects.get(id=id))

    @login_required
    def resolve_is_following(self, info, id, **kwargs):
        return len(Following.objects.filter(user=info.context.user, user_f=User.objects.get(id=id))) > 0

    @login_required
    def resolve_post(self, info, **kwargs):
        return info.context.user.posts

    @login_required
    def resolve_following_posts(self, info):
        return Post.objects.filter(user__followers__user=info.context.user)

    def resolve_user_post(self, info, id, **kwargs):
        return Post.objects.filter(user=User.objects.get(id=id))

    def resolve_user_get(self, info, id, **kwargs):
        return User.objects.get(id=id)

    @login_required
    def resolve_user(self, info, **kwargs):
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
    delete_token_cookie = graphql_jwt.relay.DeleteJSONWebTokenCookie.Field()
    delete_refresh_token_cookie = graphql_jwt.relay.DeleteRefreshTokenCookie.Field()
    token_auth = ObtainJSONWebToken.Field()
    revoke_token = graphql_jwt.relay.Revoke.Field()
    verify_token = graphql_jwt.relay.Verify.Field()
    refresh_token = graphql_jwt.relay.Refresh.Field()
    update_user = UpdateUser.Field()
    create_post = CreatePost.Field()
    create_comment = CreateComment.Field()
    like_post = LikePost.Field()
    followUser = Follow.Field()