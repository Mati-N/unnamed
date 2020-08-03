# Generated by Django 3.0.5 on 2020-08-02 09:01

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20200801_1437'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='creation',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='creation',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.CreateModel(
            name='Follwer',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='follower', to='api.User')),
                ('user_f', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='following', to='api.User')),
            ],
        ),
    ]
