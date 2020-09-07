
from django.db.models.signals import pre_save
from django.dispatch import receiver
from .models import *

@receiver(pre_save, sender=Following)
def follow_handler(sender, instance, **kwargs):
    Notification.objects.create(verb="followed you", sender=instance.follower, recipient=instance.target, category="new_follow")

@receiver(pre_save, sender=Like)
def like_handler(sender, instance, **kwargs):
    if (instance.post.user != instance.user):
        Notification.objects.create(verb="liked", sender=instance.user, recipient=instance.post.user, post=instance.post, category="new_like",)
    
@receiver(pre_save, sender=Comment)
def comment_handler(sender, instance, **kwargs):
    if (instance.post.user != instance.user):
        Notification.objects.create(verb="commented", sender=instance.user, recipient=instance.post.user, category="new_comment", comment=instance)