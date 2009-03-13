from django.contrib import admin
from example_project.app.models import Project
from django_imagehandler.inlines import OriginalInline, CropInline

# Website
class ProjectAdmin(admin.ModelAdmin):
	list_display = ('title', 'body')
	
	inlines = [
		OriginalInline,
		CropInline
	]

admin.site.register(Project, ProjectAdmin)