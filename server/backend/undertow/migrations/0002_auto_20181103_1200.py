# Generated by Django 2.1.2 on 2018-11-03 12:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('undertow', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Playlist',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.TextField()),
                ('path', models.TextField()),
                ('link', models.TextField()),
                ('songs_info', models.TextField(default='{}')),
            ],
        ),
        migrations.DeleteModel(
            name='Album',
        ),
    ]
