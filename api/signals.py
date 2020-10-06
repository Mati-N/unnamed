
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import *

@receiver(post_save, sender=Following)
def follow_handler(sender, instance, **kwargs):
    Notification.objects.create(sender=instance.follower, recipient=instance.target, category="new_follow")

@receiver(post_save, sender=Like)
def like_handler(sender, instance, **kwargs):
    if (instance.post.user != instance.user):
        Notification.objects.create(sender=instance.user, recipient=instance.post.user, post=instance.post, category="new_like",)
    
@receiver(post_save, sender=Comment)
def comment_handler(sender, instance, **kwargs):
    if (instance.post.user != instance.user):
        Notification.objects.create(sender=instance.user, recipient=instance.post.user, category="new_comment", comment=instance)