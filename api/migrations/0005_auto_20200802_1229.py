# Generated by Django 3.0.5 on 2020-08-02 09:29

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_auto_20200802_1217'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Follwer',
            new_name='Follower',
        ),
        migrations.AddField(
            model_name='comment',
            name='creation',
            field=models.DateTimeField(default=datetime.datetime(2020, 8, 2, 12, 28, 55, 983356)),
        ),
        migrations.AlterField(
            model_name='post',
            name='creation',
            field=models.DateTimeField(default=datetime.datetime(2020, 8, 2, 12, 28, 55, 982357)),
        ),
        migrations.AlterField(
            model_name='user',
            name='creation',
            field=models.DateTimeField(default=datetime.datetime(2020, 8, 2, 12, 28, 55, 982357)),
        ),
    ]
