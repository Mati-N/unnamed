from django.db import models
import pytz
from django.contrib.auth.models import User as Django_User

from utils.models import AutoTimeStamped
utc = pytz.UTC


__all__ = ['User', 'Post', 'Comment', 'Like', 'Following']


# User model
class User(AutoTimeStamped):
    user = models.OneToOneField(Django_User, on_delete=models.PROTECT)


# Post model
class Post(AutoTimeStamped):
    user = models.ForeignKey('api.User', on_delete=models.CASCADE, related_name="posts")
    title = models.CharField(max_length=260)
<<<<<<< HEAD
    text = models.CharField(max_length=5500)
    creation = models.DateTimeField(auto_now_add=True)
                                              
    def __str__(self):                                
        return f"Post {self.id}: {self.title}: created {self.before()} ago"
                                                      
=======
    text = models.TextField()

    def __str__(self):
        return f"Post {self.id}: {self.title}: created {self.created_at} ago"

    @property
    def comment_count(self):
        return self.comments.count()


>>>>>>> 46f3b16bcf601fb05a0dacdd326c2da41c406a40
# Comment model                                       
class Comment(AutoTimeStamped):
    user = models.ForeignKey('api.User', on_delete=models.CASCADE, related_name="comments")
    post = models.ForeignKey('api.Post', on_delete=models.CASCADE, related_name="comments")
    content = models.TextField()

    def __str__(self):
        return f"Comment {self.id} on Post"


# Like model
class Like(models.Model):
    user = models.ForeignKey('api.User', on_delete=models.CASCADE, related_name="likes")
    post = models.ForeignKey('api.Post', on_delete=models.CASCADE, related_name="likes")


# Following model
class Following(models.Model):
    target = models.ForeignKey('api.User', related_name='followers', on_delete=models.CASCADE, blank=False, null=True)
    follower = models.ForeignKey('api.User', related_name='targets', on_delete=models.CASCADE, blank=False, null=True)


