from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

# Create your views here.

def index(request):
    return render(request, "project_manager/index.html")

def login_view(request):
    pass

def logout_view(request):
    pass

def register(request):
    pass