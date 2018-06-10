from django.shortcuts import render
import os
import re
import json
from os import path
from .models import Album
from django.core.serializers import serialize
import time
import hashlib
import urllib.request
import urllib.parse
from django.views.decorators.csrf import csrf_exempt

# Create your views here.


from django.http import HttpResponse, JsonResponse

d = '/home/asgard/Music/psychedelic'

originalPostRoot = 'https://m.vk.com/wall-29318096_'

def index(request):
	import eyed3
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
		songs = []
		for index, file in enumerate(filter(lambda x: x.endswith('.mp3'), os.listdir(dirName))):
			audio = eyed3.load(path.join(dirName,file))
			if audio.tag is None:
				songs.append({'id': index, 'path':file, 'attributes':{}})
				continue
			tags = {}
			for tag_name in filter(lambda tag: not tag.startswith('_'), dir(audio.tag)):
				tag_value = getattr(audio.tag, tag_name)
				if type(tag_value) != str:
					continue
				tags[tag_name] = tag_value
			songs.append({'id': index, 'path':file, 'attributes':tags})
		data['songs_info'] = json.dumps(songs)

		result.append(Album(**data))
	Album.objects.bulk_create(result)
	return JsonResponse({'data': 'ok'})

def getData(request):
	result = Album.objects.all().values('path', 'description', 'link', 'id')
	return JsonResponse({'data':list(result)})

def album(request, id):
	a = Album.objects.get(pk=id)
	return JsonResponse({
		'songs': json.loads(a.songs_info),
		'path': a.path,
	})

@csrf_exempt
def scrobble(request):
	root = 'http://ws.audioscrobbler.com/2.0/'
	params = json.loads(request.body.decode())
	data = {
		'method':'track.scrobble',
		'api_key':'xxxx',
		'sk':'xxxx',
		'artist[]':params.get('artist'),
		'track[]':params.get('track'),
		'timestamp[]':str(time.time()),
	}
	print(data)
	data['api_sig'] = getApiSig(data)
	data = urllib.parse.urlencode(data).encode()
	with urllib.request.urlopen(root, data) as f:
		print(f.read().decode())
	return JsonResponse({'status':'ok'})



def getApiSig(data):
	m = hashlib.md5()
	keys = ["api_key", "artist[]", "method", "sk", "timestamp[]", "track[]"]
	secret = 'xxxx'
	s = ''
	for k in keys:
		s+=k + data[k]
	s+=secret
	m.update(s.encode())
	return m.hexdigest()