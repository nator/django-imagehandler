from django.conf.urls.defaults import *
from django.contrib import admin
from django.conf import settings
from app.views import example
import os

admin.autodiscover()

urlpatterns = patterns('',
    (r'^$', example),
    (r'^admin/', include(admin.site.urls)),
)

# Static media, Debug only
if settings.DEBUG:
	urlpatterns += patterns('',
		(r'^static/(?P<path>.*)$', 'django.views.static.serve', {'document_root': os.path.join(os.path.dirname(__file__), "static")}),
	)