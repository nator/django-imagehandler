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

    class Meta:
        unique_together = (('content_type', 'object_id'),)

    def __unicode__(self):
        try:
            return self.image.url
        except:
            return ''

# Crop
class Crop(models.Model):
    content_type = models.ForeignKey(ContentType)
    object_id = models.PositiveIntegerField()
    content_object = generic.GenericForeignKey('content_type', 'object_id')
    
    original = models.ForeignKey(Original)
    caption = models.CharField(blank=True, max_length=140)
    image = models.CharField(blank=True, max_length=140)
    x = models.IntegerField();
    y = models.IntegerField();
    width = models.IntegerField();
    height = models.IntegerField();

    class Meta:
        unique_together = (('content_type', 'object_id'),)

    def __unicode__(self):
        return u'%s' % self.image
        
    def save(self):
    
        # Remove previous image
        #if(self.id and self.image):
        #    os.remove(os.path.join(settings.MEDIA_ROOT, '%s' % self.image))
            
        location = os.path.join(settings.MEDIA_ROOT, '%s' % self.original.image)
        original = Image.open(location)
        
        box = (self.x, self.y, (self.x+self.width), (self.y+self.height))
        crop = original.crop(box)
        
        image_name = image_location(None, 'crop_%ix%i_%s' % (self.x, self.y, os.path.basename('%s' % self.original.image)))
        crop.save(os.path.join(settings.MEDIA_ROOT, image_name), "PNG")
        
        self.image = image_name

        super(Crop, self).save()