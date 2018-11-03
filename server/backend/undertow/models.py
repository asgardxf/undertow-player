from django.db import models

# Create your models here.

class Playlist(models.Model):
	description = models.TextField()
	path = models.TextField()
	link = models.TextField()
	songs_info = models.TextField(default='{}')