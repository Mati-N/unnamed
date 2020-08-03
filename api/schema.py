import graphene 
from graphene import InputObjectType
import graphql_jwt
from graphene_django.types import DjangoObjectType
from django.contrib.auth import authenticate
from graphql_jwt.decorators import login_required

from .models import *

#fd

class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ("username", "id", "is_staff")

class ObtainJSONWebToken(graphql_jwt.JSONWebTokenMutation):
    user = graphene.Field(UserType)

    @classmethod
    def resolve(cls, root, info, **kwargs):
        return cls(user=info.context.user)

class PostType(DjangoObjectType):
    class Meta:
        model = Post


class CommentType(DjangoObjectType):
    class Meta:
        model = Comment

class LikeType(DjangoObjectType):
    class Meta:
        model = Like

class UserInput(graphene.InputObjectType):
    username = graphene.String()
    password = graphene.String()

class PostInput(graphene.InputObjectType):
    title = graphene.String()
    text = graphene.String()

class CommentInput(graphene.InputObjectType):
    post = graphene.Int()
    content = graphene.String()

class CreateComment(graphene.Mutation):
    class Arguments:
        input = CommentInput(required=True)

    ok = graphene.Boolean()
    comment = graphene.Field(CommentType)

    @staticmethod
    @login_required
    def mutate(root, info, input=None):
        ok = True
        comment_instance = Comment(user=info.context.user, post=Post.objects.get(pk=input.post), content=input.content)
        comment_instance.save()

        return CreateComment(ok=ok, comment=comment_instance)

class CreatePost(graphene.Mutation):
    class Arguments:
        input = PostInput(required=True)

    ok = graphene.Boolean()
    post = graphene.Field(PostType)

    @staticmethod
    @login_required
    def mutate(root, info, input=None):
        ok = True
        post_instance = Post(user=info.context.user, title=input.title, text=input.text)
        post_instance.save()

        return CreatePost(ok=ok, post=post_instance)

class CreateUser(graphene.Mutation):
    class Arguments:
        input = UserInput(required=True)

    ok = graphene.Boolean()
    user = graphene.Field(UserType)
    message = graphene.String()


    @staticmethod
    def mutate(root, info, input=None):
        ok = False
        if info.context.user.is_authenticated:
            CreateUser(ok=ok, user=None, message="Already logged in")

        ok = True
        user_instance = User(username=input.username)
        user_instance.set_password(input.password)
        user_instance.save()

        return CreateUser(ok=ok, user=user_instance)

class UpdateUser(graphene.Mutation):
    class Arguments:
        input = UserInput(required=True)
        newP = graphene.String()

    ok = graphene.Boolean()
    user = graphene.Field(UserType)
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
    users = graphene.List(UserType, id=graphene.Int(), username=graphene.String())
    posts = graphene.List(PostType)
    comment = graphene.Field(CommentType, id=graphene.Int(), content=graphene.String())
    likes = graphene.List(LikeType)

    def resolve_users(self, info, **kwargs):
        id = kwargs.get('id')
        username = kwargs.get('username')

        if id is not None:
            return User.objects.filter(pk=id)
        elif username is not None:
            return User.objects.filter(username=username)

        return User.objects.all()

    def resolve_posts(self, info, **kwargs):
        id = kwargs.get("id")
        text = kwargs.get("text")
        title = kwargs.get("title")

        if id is not None:
            return Post.objects.get(pk=id)
        elif text is not None and title is not None:
            return Post.objects.filter(text=text, title=title)
        elif text is not None:
            return Post.objects.filter(text=text)
        elif title is not None:
            return Post.objects.filter(title=title)

        return Post.objects.all()

        return Post.objects.all()

    def reslove_comments(self, info, **kwargs):
        return Comment.objects.all()

    def resolve_likes(self, info, **kwargs):
        return Like.objects.all()

class Mutation(object):
    create_user = CreateUser.Field()
    delete_token_cookie = graphql_jwt.DeleteJSONWebTokenCookie.Field()
    delete_refresh_token_cookie = graphql_jwt.DeleteRefreshTokenCookie.Field()
    token_auth = ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()
    update_user = UpdateUser.Field()
    create_post = CreatePost.Field()
    create_comment = CreateComment.Field()