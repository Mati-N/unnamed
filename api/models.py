from django.db import models
from datetime import datetime
import pytz
from django.contrib.auth.models import User
utc=pytz.UTC
    
# Post model
class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    title = models.CharField(max_length=260)
    text = models.CharField(max_length=5500)
    commentCount = models.IntegerField(default=0)
    creation = models.DateTimeField(auto_now_add=True)
                                               
    def __str__(self):                                
        return f"Post {self.id}: {self.title}: created {self.before()} ago"
                                                      
# Comment model                                       
class Comment(models.Model):                             
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    content = models.CharField(max_length=1000)
    creation = models.DateTimeField(default=datetime.now())

    def __str__(self):
        return f"Comment {self.id} on Post"

# Like model
class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="like") 
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="likers")

# Following model
class Following(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="following") # The person who follows a person
    user_f = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followers") # The person who is being followed






