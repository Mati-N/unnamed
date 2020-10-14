
from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from graphene_subscriptions.signals import post_save_subscription
from .models import *

post_save.connect(post_save_subscription,
                  sender=Notification, dispatch_uid="notification_post_save")


@receiver(post_save, sender=Following)
def follow_handler(sender, instance, **kwargs):
    Notification.objects.create(
        sender=instance.follower, recipient=instance.target, category="new_follow")


@receiver(pre_delete, sender=Following)
def unfollow_handler(sender, instance, **kwargs):
    Notification.objects.filter(
        recipient=instance.target, sender=instance.follower, category="new_follow").delete()


@receiver(post_save, sender=Like)
def like_handler(sender, instance, **kwargs):
    if (instance.post.user != instance.user):
        Notification.objects.create(
            sender=instance.user, recipient=instance.post.user, post=instance.post, category="new_like",)


@receiver(pre_delete, sender=Like)
def unlike_handler(sender, instance, **kwargs):
    Notification.objects.filter(sender=instance.user, recipient=instance.post.user,
                                post=instance.post, category="new_like",).delete()


@receiver(post_save, sender=Comment)
def comment_handler(sender, instance, **kwargs):
    if (instance.post.user != instance.user):
        Notification.objects.create(
            sender=instance.user, recipient=instance.post.user, category="new_comment", comment=instance)
