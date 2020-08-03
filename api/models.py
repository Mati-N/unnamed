from django.db import models
from datetime import datetime
from .changeTime import *
import pytz
from django.contrib.auth.models import User

utc=pytz.UTC
    
class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    title = models.CharField(max_length=200)
    text = models.CharField(max_length=1000)
    likes = models.IntegerField(default=0)
    commentCount = models.IntegerField(default=0)
    creation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Post {self.id}: {self.title}: created {self.before()} ago"

    def before(self):
        d = str(utc.localize(datetime.now()) - self.creation)
        return changeTime(d)

class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    content = models.CharField(max_length=1000)

    def __str__(self):
        return f"Comment {self.id} on Post"

class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="like")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="likers")






