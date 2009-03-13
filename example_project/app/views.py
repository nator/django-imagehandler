from django.shortcuts import render_to_response
from example_project.app.models import Project

def example(request):
    project = Project.objects.all()[0]

    return render_to_response("app/index.html", locals())