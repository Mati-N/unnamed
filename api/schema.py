import graphene 
from graphene import InputObjectType
import graphql_jwt
from django.contrib.auth import authenticate
from graphene_django.filter import DjangoFilterConnectionField
from django_filters import OrderingFilter
from time import sleep
from django.db.models import Count, IntegerField
from django.conf import settings
from .schema.mutations import *
from .schema.querie import *

from .models import *



class Query(object):
    Users = Users.Field
    Posts = Posts.Field
    following_posts = FollowingPosts.Field()
    self_posts = SelfPost.Field()
    self_user = SelfUser.Field()
    user_post = UserPost.Field()
    get_user = GetUser.Field()
    post_comments = PostComments.Field()
    is_following = graphene.Boolean(id=graphene.ID())
    liked = graphene.Boolean(id=graphene.ID())



    @login_required
    def resolve_is_following(self, info, id, **kwargs):
        return len(Following.objects.filter(user=info.context.user, user_f=User.objects.get(id=id))) > 0


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