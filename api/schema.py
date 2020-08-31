import graphene 
from graphene import InputObjectType
import graphql_jwt
from graphene_django.types import DjangoObjectType
from django.contrib.auth import authenticate
from graphql_jwt.decorators import login_required
import django_filters
from graphene_django.filter import DjangoFilterConnectionField
from django_filters import OrderingFilter
from time import sleep
from django.db.models import Count, IntegerField
from django.conf import settings

from .models import *


class UserFilter(django_filters.FilterSet):
    class Meta:
        model = User
        fields = {'username': ['exact', 'icontains', 'istartswith']}

    order_by = OrderingFilter(
        fields=(
            ('date_joined', 'date'), ('username', 'username')
        )
    )

# The user model's type
class UserNode(DjangoObjectType):
    id = graphene.ID(source='pk', required=True)
    follower_count = graphene.Int(source="follower_count")
    post_count = graphene.Int(source="post_count")

    class Meta:
        model = User
        interfaces = (graphene.relay.Node,)


# JSON Web token generator which stores the user object
class ObtainJSONWebToken(graphql_jwt.relay.JSONWebTokenMutation):
    user = graphene.Field(UserNode)

    @classmethod
    def resolve(cls, root, info, **kwargs):
        return cls(user=info.context.user)

class PostFilter(django_filters.FilterSet):
    class Meta:
        model = Post
        fields = {'title': ['exact', 'icontains', 'istartswith'], 'text': ['exact', 'icontains', 'istartswith'], 'user': ['exact']}
        
    order_by = OrderingFilter(
        fields=(
            ('-created_at', 'created_at'), ("like_count", "like_count")
        )
    )

# The post model's type
class PostNode(DjangoObjectType):
    id = graphene.ID(source='pk', required=True)
    like_count = graphene.Int(source="like_count")
    comment_count = graphene.Int(source="comment_count")

    class Meta:
        model = Post
        interfaces = (graphene.relay.Node,)


class CommentFilter(django_filters.FilterSet):
    class Meta:
        model = Comment
        fields = {'content': ['exact', 'icontains', 'istartswith']}

# The comment model's type
class CommentNode(DjangoObjectType):
    class Meta:
        model = Comment
        interfaces = (graphene.relay.Node,)


# The like model's type
class LikeType(DjangoObjectType):
    class Meta:
        model = Like

class UserType(DjangoObjectType):
    followers = graphene.Int(source="followers")
    posts = graphene.Int(source="posts")

    class Meta:
        model = User

class FollowNode(DjangoObjectType):
    class Meta:
        model = Following
        interfaces = (graphene.relay.Node,)

# The input needed to work with the user model
class UserInput(graphene.InputObjectType):
    username = graphene.String()
    password = graphene.String()

# The input needed to work with the post model
class PostInput(graphene.InputObjectType):
    title = graphene.String()
    text = graphene.String()

# The input needed to work wiht the comment model
class CommentInput(graphene.InputObjectType):
    post = graphene.ID()
    content = graphene.String()

# The mutation which create a comment
class CreateComment(graphene.Mutation):
    class Arguments:
        input = CommentInput(required=True)

    ok = graphene.Boolean()
    comment = graphene.Field(CommentNode)

    @staticmethod
    @login_required
    def mutate(root, info, input=None):
        ok = True
        comment_instance = Comment(user=info.context.user, post=Post.objects.get(pk=input.post), content=input.content)
        comment_instance.save()

        return CreateComment(ok=ok, comment=comment_instance)

# The mustation which creates a post
class CreatePost(graphene.Mutation):
    class Arguments:
        input = PostInput(required=True)

    ok = graphene.Boolean()
    post = graphene.Field(PostNode)

    @staticmethod
    @login_required
    def mutate(root, info, input):
        ok = False
        post_instance = Post(user=info.context.user, title=input.title, text=input.text)
        post_instance.save()
        ok = True

        return CreatePost(ok=ok, post=post_instance)


class Follow(graphene.Mutation):
    class Arguments:
        id = graphene.ID()

    ok = graphene.Boolean()
    user = graphene.Field(UserNode)
    message = graphene.String()

    @staticmethod
    @login_required
    def mutate(root, info, id):
        ok = True
        user_instance = User.objects.get(id=id)
        follow_instance = Following.objects.filter(user=info.context.user, user_f=user_instance)
        if len(follow_instance) > 0:
            follow_instance[0].delete()
            return Follow(ok=ok, user=user_instance, message="Unfollowed")

        follow_instance = Following(user=info.context.user, user_f=User.objects.get(id=id))
        follow_instance.save()

        return Follow(ok=ok, user=user_instance, message="Followed")


class LikePost(graphene.Mutation):
    class Arguments:
        post_id = graphene.ID()

    ok = graphene.Boolean()
    like = graphene.Field(LikeType)
    post = graphene.Field(PostNode)

    @staticmethod
    @login_required
    def mutate(root, info, post_id):
        ok = True
        post_instance = Post.objects.get(pk=post_id)
        like_instance = Like.objects.filter(user=info.context.user, post=post_instance)
        if len(like_instance) > 0:
            like_instance[0].delete()
            return LikePost(ok=ok, post=post_instance, like=None)

        like_instance = Like(user=info.context.user, post=post_instance)
        like_instance.save()

        return LikePost(ok=ok, post=post_instance,like=like_instance)


# A mutation used to create a user
class CreateUser(graphene.Mutation):
    class Arguments:
        input = UserInput(required=True)

    ok = graphene.Boolean()
    user = graphene.Field(UserNode)
    message = graphene.String()


    @staticmethod
    def mutate(root, info, input):
        ok = False
        if info.context.user.is_authenticated:
            return CreateUser(ok=ok, user=info.context.user, message="Already logged in")

        if User.objects.filter(username=input.username):
            return CreateUser(ok=ok, user=None, message="Username is already in use")

        ok = True
        user_instance = User(username=input.username)
        user_instance.set_password(input.password)
        user_instance.save()

        return CreateUser(ok=ok, user=user_instance)

# A mutation used to update a user's properties
class UpdateUser(graphene.Mutation):
    class Arguments:
        input = UserInput(required=True)
        newP = graphene.String()

    ok = graphene.Boolean()
    user = graphene.Field(UserNode)
    message = graphene.String()

    @staticmethod
    @login_required
    def mutate(root, info, newP=None, input=None):
        ok = False
        user_instance = User.objects.get(id=info.context.user.id)

        if user_instance:
            if not user_instance.check_password(input.password):
                return UpdateUser(ok=ok, user=user_instance, message="Password is incorrect")

            ok = True
            if input.username:
                user_instance.username = input.username

            if newP is not None:
                user_instance.set_password(newP)

            user_instance.save()

            return UpdateUser(ok=ok, user=user_instance)
                

        return UpdateUser(ok=ok, user=user_instance, message="Successful")

class Query(object):
    users = DjangoFilterConnectionField(UserNode, filterset_class=UserFilter, id=graphene.ID(), user_name=graphene.String())
    posts = DjangoFilterConnectionField(PostNode, filterset_class=PostFilter, id=graphene.ID(), post_title=graphene.String(), post_text=graphene.String())
    following_posts = DjangoFilterConnectionField(PostNode, filterset_class=PostFilter, id=graphene.ID(), post_title=graphene.String(), post_text=graphene.String())
    post = DjangoFilterConnectionField(PostNode, filterset_class=PostFilter, post_title=graphene.String(), post_text=graphene.String())
    user_post = DjangoFilterConnectionField(PostNode, filterset_class=PostFilter, id=graphene.ID(), post_title=graphene.String(), post_text=graphene.String())
    user = graphene.Field(UserType)
    user_get = graphene.Field(UserType, id=graphene.ID())
    comments = DjangoFilterConnectionField(CommentNode, filterset_class=CommentFilter)
    post_comments = DjangoFilterConnectionField(CommentNode, filterset_class=CommentFilter, id=graphene.ID())
    likes = graphene.List(LikeType)
    is_following = graphene.Boolean(id=graphene.ID())
    liked = graphene.Boolean(id=graphene.ID())

    def resolve_users(self, info,  **kwargs):
        id = kwargs.get('id')
        username = kwargs.get('username')

        if id is not None:
            return User.objects.filter(pk=id)
        elif username is not None:
            return User.objects.filter(username=username)

        return User.objects.all()

    def resolve_post_comments(self, info, id, **kwargs):
        return Comment.objects.filter(post=Post.objects.get(id=id))

    def resolve_is_following(self, info, id, **kwargs):
        return len(Following.objects.filter(user=info.context.user, user_f=User.objects.get(id=id))) > 0

    def resolve_post(self, info, **kwargs):
        return info.context.user.posts

    def resolve_following_posts(self, info):
        return Post.objects.filter(user__followers__user=info.context.user)

    def resolve_user_post(self, info, id, **kwargs):
        return Post.objects.filter(user=User.objects.get(id=id))

    def resolve_user_get(self, info, id, **kwargs):
        return User.objects.get(id=id)

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

    def resolve_likes(self, info, **kwargs):
        return Like.objects.all()

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