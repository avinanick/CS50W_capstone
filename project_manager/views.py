from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import JsonResponse
import json
import datetime

from .models import User, Project, Deadline, Task, Authority, Membership, Workflow

# Create your views here.
@login_required
def index(request):
    return render(request, "project_manager/index.html")

@login_required
def authority(request, project_id):
    if not Membership.objects.filter(project=Project.objects.get(id=project_id), member=request.user).exists():
        return JsonResponse({"auth_level": "none"})
    member_set = Membership.objects.get(project=Project.objects.get(id=project_id), member=request.user)
    return JsonResponse({"auth_level": member_set.auth_level.level})

@login_required
def create_deadline(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    data = json.loads(request.body)
    linked_project = Project.objects.get(id=data["project_id"])
    submitted_date = datetime.date(data["year"], data["month"], data["day"])
    new_deadline = Deadline(
        project=linked_project, 
        due_date=submitted_date)

    new_deadline.save()
    return JsonResponse({"message": "Deadline created."}, status=201)

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

@login_required
def create_task(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    
    data = json.loads(request.body)
    linked_project = Project.objects.get(id=data["project_id"])

    new_task = Task(
        creator=request.user,
        description=data["description"],
        title=data["title"],
        project=linked_project,
        flow_status=Workflow.objects.get(name="To Do")
    )
    if Deadline.objects.filter(id=data["deadline_id"]).exists():
        new_task.deadline = Deadline.objects.get(id=data["deadline_id"])

    new_task.save()

    return JsonResponse({"message": "Task created."}, status=201)


@login_required
def deadlines(request, project_id):
    # Check to make sure the logged in user has access to this project, if so, return the list
    # of project deadlines
    requested_project = Project.objects.get(id=project_id)
    member_check = Membership.objects.filter(member=request.user, project=requested_project)
    if not member_check:
        return JsonResponse({"error": "User not authorized for project,"}, status=400)
    deadlines = Deadline.objects.order_by("-due_date").filter(project=requested_project)

    return JsonResponse({"deadlines":[{
        "id":deadline.id, 
        "date": deadline.due_date.strftime("%m/%d/%Y")} 
        for deadline in deadlines]})

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
def members(request, project_id):
    requested_project = Project.objects.get(id=project_id)
    member_check = Membership.objects.filter(member=request.user, project=requested_project)
    if not member_check.exists():
        return JsonResponse({"error": "User not authorized for project,"}, status=400)
    member_check = member_check[0]

    if request.method == "POST":
        # Used for inviting or removing members
        if member_check.auth_level.level == "Member":
            return JsonResponse({"error": "No authority for action"}, status=400)
        data = json.loads(request.body)
        if data["member_edit"] == "invite":
            if User.objects.filter(username=data["username"]).exists() and not Membership.objects.filter(project=requested_project, member=User.objects.get(username=data["username"])).exists():
                new_membership = Membership(
                    project=requested_project,
                    member=User.objects.get(username=data["username"]),
                    auth_level=Authority.objects.get(level="Member"))
                new_membership.save()
                return JsonResponse({"message": "Member added to project"}, status=201)
        
        target_user = User.objects.get(username=data["username"])

        if data["member_edit"] == "remove":
            target_membership = Membership.objects.get(project=requested_project, member=target_user)
            if target_membership.auth_level.level == "Manager" and member_check.auth_level.level != "Owner":
                return JsonResponse({"error": "No authority for action"}, status=400)
            target_membership.delete()
            return JsonResponse({"message": "Member removed from project"}, status=201)

        if data["member_edit"] == "promote":
            if member_check.auth_level.level != "Owner":
                return JsonResponse({"error": "No authority for action"}, status=400)
            target_membership = Membership.objects.get(project=requested_project, member=target_user)
            target_membership.auth_level = Authority.objects.get(level="Manager")
            target_membership.save()
            return JsonResponse({"message": "Member promoted to manager"}, status=201)

        if data["member_edit"] == "demote":
            if member_check.auth_level.level != "Owner":
                return JsonResponse({"error": "No authority for action"}, status=400)
            target_membership = Membership.objects.get(project=requested_project, member=target_user)
            target_membership.auth_level = Authority.objects.get(level="Member")
            target_membership.save()
            return JsonResponse({"message": "Member demoted to member"}, status=201)

    all_members = Membership.objects.filter(project=requested_project)
    return JsonResponse({"members": [{
        "name": member.member.username, 
        "authority": member.auth_level.level} 
        for member in all_members]})

@login_required
def project(request, project_id):
    project_accessed = Project.objects.filter(id=project_id)
    if project_accessed.count() < 1:
        return # STUB: Need an error page to show
    requested_project = Project.objects.get(id=project_id)
    member_check = Membership.objects.filter(member=request.user, project=requested_project)
    if not member_check:
        return JsonResponse({"error": "User not authorized for project,"}, status=400)

    return render(request, "project_manager/project_page.html", {
        "project_id": project_id
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

@login_required
def update_task(request):
    if request.method == "PUT":
        # update the workflow
        data = json.loads(request.body)
        task_to_update = Task.objects.get(id=data["task_id"])
        task_to_update.flow_status = Workflow.objects.get(name=data["workflow"])
        task_to_update.save()
        return JsonResponse({"message": "Task workflow updated"}, status=201)

    if request.method == "POST":
        data = json.loads(request.body)
        task_to_update = Task.objects.get(id=data["task_id"])
        task_to_update.title = data["title"]
        task_to_update.description = data["description"]
        if Deadline.objects.filter(id=data["deadline_id"]).count() > 0:
            task_to_update.deadline = Deadline.objects.get(id=data["deadline_id"])
        else:
            task_to_update.deadline = None
        task_to_update.save()
        return JsonResponse({"message": "Task workflow updated"}, status=201)

    return JsonResponse({"error": "Unsupported request method."}, status=400)


@login_required
def tasks(request, project_id, deadline_id):
    requested_project = Project.objects.get(id=project_id)
    member_check = Membership.objects.filter(member=request.user, project=requested_project)
    if not member_check:
        return JsonResponse({"error": "User not authorized for project,"}, status=400)
    
    if Deadline.objects.filter(id=deadline_id).exists():
        requested_tasks = Task.objects.filter(project=requested_project, deadline=Deadline.objects.get(id=deadline_id))
        return JsonResponse({"tasks": [{
            "title": task.title,
            "description": task.description,
            "date_created": task.date_created.strftime("%m/%d/%Y"),
            "flow_status": task.flow_status.name,
            "creator": task.creator.username,
            "id": task.id,
            "deadline_id": task.deadline.id
            } for task in requested_tasks]})
    else:
        requested_tasks = Task.objects.filter(project=requested_project, deadline__isnull=True)

        return JsonResponse({"tasks": [{
            "title": task.title,
            "description": task.description,
            "date_created": task.date_created.strftime("%m/%d/%Y"),
            "flow_status": task.flow_status.name,
            "creator": task.creator.username,
            "id": task.id,
            "deadline_id": 0
            } for task in requested_tasks]})