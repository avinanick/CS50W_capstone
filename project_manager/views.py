from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import JsonResponse
import json

from .models import User, Project, Deadline, Task, Authority, Membership

# Create your views here.
@login_required
def index(request):
    return render(request, "project_manager/index.html")

@login_required
def create_project(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    
    data = json.loads(request.body)

    check_project = Project.objects.filter(creator=request.user, name=data["project_name"])
    if check_project.count() > 0:
        return JsonResponse({"error": "Matching project already exists."}, status=400)

    new_project = Project(
        creator = request.user, 
        name = data["project_name"], 
        description=data["project_description"])
    new_project.save()

    new_membership = Membership(
        project=new_project,
        member=request.user,
        auth_level=Authority.objects.get(level="Owner")
    )
    new_membership.save()
    return JsonResponse({"message": "Project created."}, status=201)

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return redirect("index")
        else:
            return render(request, "project_manager/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "project_manager/login.html")

def logout_view(request):
    logout(request)
    return redirect("login")

@login_required
def project(request, project_id):
    return render(request, "project_manager/project_page.html", {
        
    })

@login_required
def projects(request):
    user_memberships = Membership.objects.filter(member=request.user)
    user_projects = []
    for membership in user_memberships:
        user_projects.append(membership.project)
    
    return JsonResponse({"projects":[{"name": project.name, "id": project.id} for project in user_projects]})

def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "project_manager/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "project_manager/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return redirect("index")
    else:
        return render(request, "project_manager/register.html")