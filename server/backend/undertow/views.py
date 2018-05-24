from django.shortcuts import render
import os
import re
from os import path
from .models import Album
from django.core.serializers import serialize

# Create your views here.


from django.http import HttpResponse, JsonResponse

d = '/home/asgardxf/Music/music_dump'

originalPostRoot = 'https://m.vk.com/wall-29318096_'

def index(request):
	result = []
	for album in os.listdir(d):
		dirName = path.join(d, album)
		if not path.isdir(dirName):
			continue
		if not path.exists(path.join(dirName, 'cover')):
			continue
		with open(path.join(dirName, 'description.txt')) as f:
			desc = f.read()

		match = re.search('^(\d+)', album)
		originalPost = originalPostRoot + match.group(1)
		data = {
			'path':album,
			'description': desc,
			'link': originalPost,
		}
		result.append(Album(**data))
	Album.objects.bulk_create(result)
	return JsonResponse({'data': 'ok'})

def getData(request):
	result = Album.objects.all().values('path', 'description', 'link', 'id')
	return JsonResponse({'data':list(result)})

def album(request, id):
	a = Album.objects.get(pk=id)
	files = filter(lambda x: x.endswith('.mp3'), os.listdir(path.join(d, a.path)))
	return JsonResponse({
		'files' :list(files)
	})