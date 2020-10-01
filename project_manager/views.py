from django.shortcuts import render

# Create your views here.

def index(request):
    return render(request, "project_manager/index.html")

def login(request):
    pass

def logout(request):
    pass

def register(request):
    pass