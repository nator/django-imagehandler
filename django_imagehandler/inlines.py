from django.contrib import admin
from models import Original, Crop
from django.contrib.contenttypes import generic

class OriginalInline(generic.GenericStackedInline):
	model = Original
	extra = 3
	template = 'originals.html'
	
class CropInline(generic.GenericTabularInline):
	model = Crop
	extra = 3
	template = 'crops.html'
