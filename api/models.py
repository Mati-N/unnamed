from django.db import models
import pytz
from django.contrib.auth.models import AbstractUser
from django.conf import settings

from utils.models import AutoTimeStamped
utc = pytz.UTC

__all__ = ['User', 'Post', 'Comment', 'Like', 'Following']


class User(AbstractUser):
    bio = models.TextField(max_length=500, blank=True, null=True)

    @property
    def follower_count(self):
        return self.followers.count()

    @property
    def post_count(self):
        return self.posts.count()

class Post(AutoTimeStamped):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="posts")
    title = models.CharField(max_length=260)
    text = models.TextField()

    def __str__(self):
        return f"Post {self.id}: {self.title}: created {self.created_at} ago"

    @property
    def comment_count(self):
        return self.comments.count()

    @property
    def like_count(self):
        return self.likes.count()


class Comment(AutoTimeStamped):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="comments")
    post = models.ForeignKey('api.Post', on_delete=models.CASCADE, related_name="comments")
    content = models.TextField()

    def __str__(self):
        return f"Comment {self.id} on Post"


class Like(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="likes")
    post = models.ForeignKey('api.Post', on_delete=models.CASCADE, related_name="likes")


class Following(models.Model):
    target = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='followers', on_delete=models.CASCADE)
    follower = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='targets', on_delete=models.CASCADE)


