# Generated by Django 3.1 on 2020-08-30 14:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_remove_user_bio'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='bio',
            field=models.TextField(blank=True, max_length=500, null=True),
        ),
    ]
