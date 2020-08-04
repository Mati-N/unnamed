import graphene 
from graphene import InputObjectType
import graphql_jwt
from graphene_django.types import DjangoObjectType
from django.contrib.auth import authenticate
from graphql_jwt.decorators import login_required
import django_filters
from graphene_django.filter import DjangoFilterConnectionField
from django_filters import OrderingFilter



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
    class Meta:
        model = User
        interfaces = (graphene.relay.Node,)


# JSON Web token generator which stores the user object
class ObtainJSONWebToken(graphql_jwt.JSONWebTokenMutation):
    user = graphene.Field(UserNode)

    @classmethod
    def resolve(cls, root, info, **kwargs):
        return cls(user=info.context.user)

class PostFilter(django_filters.FilterSet):
    class Meta:
        model = Post
        fields = {'title': ['exact', 'icontains', 'istartswith'], 'text':['exact', 'icontains', 'istartswith'], 'user': ['exact']}
    order_by = OrderingFilter(
        fields=(
            ('creation', 'likes'),
        )
    )

# The post model's type
class PostNode(DjangoObjectType):
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
    post = graphene.Int()
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
    def mutate(root, info, input=None):
        ok = True
        post_instance = Post(user=info.context.user, title=input.title, text=input.text)
        post_instance.save()

        return CreatePost(ok=ok, post=post_instance)

# A mutation used to create a user
class CreateUser(graphene.Mutation):
    class Arguments:
        input = UserInput(required=True)

    ok = graphene.Boolean()
    user = graphene.Field(UserNode)
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
    user = graphene.relay.Node.Field(UserNode)
    users = DjangoFilterConnectionField(UserNode, filterset_class=UserFilter)
    post = graphene.relay.Node.Field(PostNode)
    posts = DjangoFilterConnectionField(PostNode, filterset_class=PostFilter)
    comment = graphene.relay.Node.Field(CommentNode)
    comments = DjangoFilterConnectionField(CommentNode, filterset_class=CommentFilter)
    likes = graphene.List(LikeType)

    def resolve_users(self, info,  **kwargs):
        id = kwargs.get('id')
        username = kwargs.get('username')

        if id is not None:
            return User.objects.filter(pk=id)
        elif username is not None:
            return User.objects.filter(username=username)

        return User.objects.all()

    def resolve_posts(self, info, order="creation", **kwargs):
        id = kwargs.get("id")
        text = kwargs.get("text")
        title = kwargs.get("title")

        if id is not None:
            return Post.objects.get(pk=id)
        elif text is not None and title is not None:
            return Post.objects.filter(text=text, title=title, order_by=order)
        elif text is not None:
            return Post.objects.filter(text=text, order_by=order)
        elif title is not None:
            return Post.objects.filter(title=title, order_by=order)

        return Post.objects.all().order_by(order, "likes")

    def reslove_comments(self, info, order="creation", **kwargs):
        return Comment.objects.all().order_by(order)

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