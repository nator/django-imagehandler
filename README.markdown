
# Django-Imagehandler

A django app created to make handling images related to objects easier.


## Main features include:

* Image cropping
* Fetching image with identifiers directly from templates (i.e. a thumbnail)


## err, what?

To *get* what this whole thing is about, check out the screencast. (screencast not yet ready (insert underconstruction.gif here)).


## Installation

 Add the django_imagehandler directory to your python path. I do this by symlinking it to my site-packages directory:

    ln -s /path/to/django_imagehandler /path/to/python/site-packages/django_imagehandler


 Copy or symlink the directory `imagehandler_resources` to the admin applications media directory:

	ln -s /path/to/django_imagehandler/imagehandlerresources /path/to/django/contrib/admin/media/imagehandler_resources


 Add the following snippet of code to the template located at `/path/to/python/contrib/admin/templates/admin/base.html`, in the `head`:

    <link rel="stylesheet" type="text/css" href="{% admin_media_prefix %}imagecropper/css/jquery.resizeable.css" />
	<link rel="stylesheet" type="text/css" href="{% admin_media_prefix %}imagecropper/css/styles.css" />
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