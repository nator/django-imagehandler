from django import template
from django.template import Library, Variable
from django.contrib.contenttypes.models import ContentType
from imagecropper.models import Crop
     
register = Library()

@register.tag
def get_images_count(parser, token):
    content = token.split_contents();
    return ImagesCount(content[2], content[4])


class ImagesCount(template.Node):
    def __init__(self, obj, context_var):
        self.context_var = context_var
        self.obj = Variable(obj)

    def render(self, context):
        self.obj = self.obj.resolve(context)
        
        obj_type = ContentType.objects.get_for_model(self.obj)
        count = Crop.objects.filter(content_type__pk=obj_type.id, object_id=self.obj.id).count()
        
        context[self.context_var] = count
        return ''


@register.tag
def get_images_list(parser, token):
    content = token.split_contents();
    return ImagesList(content[2], content[4])


class ImagesList(template.Node):
    def __init__(self, obj, context_var):
        self.context_var = context_var
        self.obj = Variable(obj)

    def render(self, context):
        self.obj = self.obj.resolve(context)
        obj_type = ContentType.objects.get_for_model(self.obj)
        
        context[self.context_var] = Crop.objects.filter(content_type__pk=obj_type.id, object_id=self.obj.id)
        return ''


@register.tag
def get_image(parser, token):
    try:
        # split_contents() knows not to split quoted strings.
        tag_name, obj, uniq_id, for_tag, context_var = token.split_contents()
    except ValueError:
        raise template.TemplateSyntaxError, "%r tag requires exactly four arguments" % token.contents.split()[0]
    if not (uniq_id[0] == uniq_id[-1] and uniq_id[0] in ('"', "'")):
        raise template.TemplateSyntaxError, "%r tag's argument should be in quotes" % tag_name
        
    return GetImage(obj, uniq_id, context_var)


class GetImage(template.Node):
    def __init__(self, obj, uniq_id, context_var):
        self.uniq_id = uniq_id
        self.obj = Variable(obj)
        self.context_var = context_var

    def render(self, context):
        self.obj = self.obj.resolve(context)
        obj_type = ContentType.objects.get_for_model(self.obj)
        
        context[self.context_var] = Crop.objects.get(uniq_id=self.uniq_id[1:-1], content_type__pk=obj_type.id, object_id=self.obj.id)
        return ''