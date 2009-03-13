from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes import generic
from django.conf import settings
import os
import random
import string
import Image

# Generate a random string
def random_string(length=8, chars=string.letters + string.digits):
    return ''.join([chars[random.randrange(0,len(chars))] for i in range(length)])

# Image location for original
def image_location(instance, filename):
    return 'images/%s-%s' % (random_string(), filename)

# Original image model
class Original(models.Model):
    content_type = models.ForeignKey(ContentType)
    object_id = models.PositiveIntegerField()
    content_object = generic.GenericForeignKey('content_type', 'object_id')
    image = models.ImageField(upload_to=image_location)

    def __unicode__(self):
        return self.image.url
        #return '%s: %s' % (self.content_object, self.image.url.split('/')[-1][9:])

# Crop
class Crop(models.Model):
    content_type = models.ForeignKey(ContentType)
    object_id = models.PositiveIntegerField()
    content_object = generic.GenericForeignKey('content_type', 'object_id')
    
    original = models.ForeignKey(Original)
    identifier = models.CharField(blank=True, max_length=140)
    caption = models.CharField(blank=True, max_length=140)
    image = models.CharField(blank=True, max_length=140)
    x = models.IntegerField();
    y = models.IntegerField();
    width = models.IntegerField();
    height = models.IntegerField();

    def __unicode__(self):
        return u'%s' % self.image
    
    def url(self):
        if(not settings.MEDIA_URL.endswith('/')):
            return "%s/%s" % (settings.MEDIA_URL, self.image)
        else:
            return "%s%s" % (settings.MEDIA_URL, self.image)

    def delete(self):
        # Remove image
        os.remove(os.path.join(settings.MEDIA_ROOT, '%s' % self.image))
        super(Crop, self).delete()
  
    def save(self):
    
        # Not the first save
        if(self.id and self.image):
            os.remove(os.path.join(settings.MEDIA_ROOT, '%s' % self.image))
        else:
            self.image = image_location(None, 'crop_%ix%i_%s' % (self.x, self.y, os.path.basename('%s' % self.original.image)))
            
        location = os.path.join(settings.MEDIA_ROOT, '%s' % self.original.image)
        original = Image.open(location)
        
        box = (self.x, self.y, (self.x+self.width), (self.y+self.height))
        crop = original.crop(box)
        crop.save(os.path.join(settings.MEDIA_ROOT, self.image), "PNG")

        super(Crop, self).save()