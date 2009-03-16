
# Django-Imagehandler

A django app created to make handling images related to objects easier. Includes a cropping tool as well as a few simple template tags for basic fetching.

An example use for this application is handling screenshots in your online work portfolio. Imagehandler removes any need to open up your favorite image editor to crop your photos, as well as any need to recrop them in the future. (i.e., a redesign might require new sizes.)

**Note:** This app is by no means finished and is still under development, and no testing has been done for any browser except Safari & Firefox for now.

I would love any feedback you might have, shoot them my way at luddep [at] gmail [dot] com.


## Screencast

To clear up some of the initial confusion you might have, I threw together a quick screencast showing off the cropping feature:

### <http://vimeo.com/3628738>.

## Dependencies

* Python Imaging Library

## Installation

 Add the django_imagehandler directory to your python path. I do this by symlinking it to my site-packages directory:

    ln -s /path/to/django_imagehandler /path/to/python/site-packages/django_imagehandler


 Copy or symlink the directory `imagehandler_resources` to the admin applications media directory:

	ln -s /path/to/django_imagehandler/imagehandlerresources /path/to/django/contrib/admin/media/imagehandler_resources


 Add the following snippet of code to the template located at `/path/to/python/contrib/admin/templates/admin/base.html`, in the `head`:

    <link rel="stylesheet" type="text/css" href="{% admin_media_prefix %}imagehandler_resources/css/jquery.resizeable.css" />
    <link rel="stylesheet" type="text/css" href="{% admin_media_prefix %}imagehandler_resources/css/styles.css" />
    <script src="{% admin_media_prefix %}imagehandler_resources/js/jquery.min.js" type="text/javascript" language="javascript"></script>
    <script src="{% admin_media_prefix %}imagehandler_resources/js/jquery.event.drag.js" type="text/javascript" language="javascript"></script>
    <script src="{% admin_media_prefix %}imagehandler_resources/js/jquery.dragwithbounds.js" type="text/javascript" language="javascript"></script>
    <script src="{% admin_media_prefix %}imagehandler_resources/js/jquery.resizeable.js" type="text/javascript" language="javascript"></script>
    <script src="{% admin_media_prefix %}imagehandler_resources/js/admin.setup.js" type="text/javascript" language="javascript"></script>


 Add `django_imagehandler` to `INSTALLED_APPS` in your projects `settings.py` file.


 To any model that you would like to use the imagehandler with, add the following to your `admin.py` file:

    from django_imagehandler.inlines import OriginalInline, CropInline

    class MyAdmin(admin.ModelAdmin):

		...
		
		inlines = [
			OriginalInline,
			CropInline
		]
		
		...
