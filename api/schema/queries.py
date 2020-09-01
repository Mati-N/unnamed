from graphene_django.filter import DjangoFilterConnectionField
from graphql_jwt.decorators import login_required
import graphene
from .Nodes import *
from models import *

users = DjangoFilterConnectionField(UserNode, id=graphene.ID(), user_name=graphene.String())

class Users(DjangoFilterConnectionField):
    class Meta:
        id = grapene.ID()
        username = graphene.String()
        node = UserNode

    @staticmethod
    def resolve(self, info,  input):
        id = input.get('id')
        username = input.get('username')

        if id is not None:
            return User.objects.filter(pk=id)
        elif username is not None:
            return User.objects.filter(username=username)

        return User.objects.all()


class Posts(DjangoFilterConnectionField):
    class Meta:
        id = graphene.ID()
        post_title = graphene.String()
        post_text = graphene.String()
        node = PostNode

    @staticmethod
    def resolve(self, info, input):
        id = input.get('id')
        title = input.get('title')
        text = input.get('text')

        if id is not None:
            return Post.objects.filter(pk=id)
        elif text is not None and title is not None:
            return Post.objects.filter(text=text, title=title)
        elif text is not None:
            return Post.objects.filter(text=text)
        elif title is not None:
            return Post.objects.filter(title=title)


        return Post.objects.all()

class FollowingPosts(DjangoFilterConnectionField):
    class Meta:
        node = FollowNode
        id = graphene.ID()
        post_title = graphene.String()
        post_text = graphene.String()
        
    @login_required
    @staticmethod
    def resolve(self, info):
        return Post.objects.filter(user__followers__user=info.context.user)

    self_post = DjangoFilterConnectionField(PostNode, post_title=graphene.String(), post_text=graphene.String())
class SelfPosts(DjangoFilterConnectionField):
    class Meta:
        node = PostNode
        post_title = graphene.String()
        post_text = graphene.String()

    @login_required
    @staticmethod
    def resolve(self, info, **kwargs):
        return info.context.user.posts

class SelfUser(graphene.relay.Node.Field):
    class Meta:
        node = UserNode

    @login_required
    @staticmethod
    def resolve(self, info, **kwargs):
        return info.context.user

class UserPost(DjangoFilterConnectionField):
    class Meta:
        node = PostNode
        id = graphene.ID()
        post_title = graphene.String()
        post_text = graphene.String()
        
    @staticmethod
    @login_required
    def resolve(self, info, input):
        return Post.objects.filter(user=User.objects.get(id=input.id))

class GetUser(graphene.relay.Node.Field):
    class Meta:
        node = UserNode
        id = graphene.ID()
    @login_required
    @staticmethod
    def resolve(self, info, input):
        return User.objects.get(id=input.id)


class Comments(DjangoFilterConnectionField):
    class Meta:
        node = CommentNode

    @staticmethod
    def resolve(self, info,  input):
        return Comment.objects.all()

    post_comments = DjangoFilterConnectionField(CommentNode, id=graphene.ID())

class PostComments(DjangoFilterConnectionField):
    class Meta:
        node = CommentNode
        id = graphene.ID()

    @staticmethod
    def resolve(self, info, input):
        return Comment.objects.filter(post=Post.objects.get(id=input.id))

    
