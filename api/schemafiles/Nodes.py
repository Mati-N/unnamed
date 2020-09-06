import django_filters
import graphene
from graphene_django.types import DjangoObjectType
from django_filters import OrderingFilter
from ..models import *

__all__ = ['UserNode', 'PostNode', 'CommentNode', 'FollowNode', 'LikeNode', 'NotifNode']


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
        filterset_class = UserFilter

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
        filterset_class = PostFilter


class CommentFilter(django_filters.FilterSet):
    class Meta:
        model = Comment
        fields = {'content': ['exact', 'icontains', 'istartswith']}

# The comment model's type
class CommentNode(DjangoObjectType):
    class Meta:
        model = Comment
        interfaces = (graphene.relay.Node,)
        filterset_class = CommentFilter

class FollowNode(DjangoObjectType):
    class Meta:
        model = Following
        interfaces = (graphene.relay.Node,)

class LikeNode(DjangoObjectType):
    class Meta:
        model = Like
        interfaces = (graphene.relay.Node,)

class NotifNode(DjangoObjectType):
    class Meta:
        model = Notification
        interfaces = (graphene.relay.Node,)