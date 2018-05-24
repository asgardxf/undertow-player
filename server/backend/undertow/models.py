from django.db import models

# Create your models here.

class Album(models.Model):
	description = models.TextField()
	path = models.TextField()
	link = models.TextField()