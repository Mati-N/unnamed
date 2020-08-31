from django.db import models

__all__ = ['AutoTimeStamped']

# The name describes it
class AutoTimeStamped(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)
    l = models.IntegerField(default=10)

    class Meta:
        abstract = True
