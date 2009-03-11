from django.contrib import admin
from models import Original, Crop
from django.contrib.contenttypes import generic

class OriginalInline(generic.GenericStackedInline):
	model = Original
	max_num = 2
	extra = 2
	template = 'originals.html'
	
class CropInline(generic.GenericTabularInline):
	model = Crop
	max_num = 2
	extra = 2
	template = 'crops.html'
