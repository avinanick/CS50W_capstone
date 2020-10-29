from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Project(models.Model):
    creator = models.ForeignKey("User", on_delete=models.CASCADE, related_name="projects")
    name = models.CharField(max_length=256)
    description = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)

class Deadline(models.Model):
    project = models.ForeignKey("Project", on_delete=models.CASCADE, related_name="deadlines")
    due_date = models.DateTimeField()

class Task(models.Model):
    creator = models.ForeignKey("User", on_delete=models.CASCADE, related_name="tasks")
    project = models.ForeignKey("Project", on_delete=models.CASCADE, related_name="tasks")
    deadline = models.ForeignKey("Deadline", null=True, on_delete=models.SET_NULL, related_name="tasks")
    title = models.CharField(max_length=1024)
    description = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)
    flow_status = models.ForeignKey("Workflow", on_delete=models.CASCADE, related_name="tasks")

class Authority(models.Model):
    level = models.CharField(max_length=16)

class Membership(models.Model):
    member = models.ForeignKey("User", on_delete=models.CASCADE, related_name="memberships")
    project = models.ForeignKey("Project", on_delete=models.CASCADE, related_name="members")
    auth_level = models.ForeignKey("Authority", on_delete=models.PROTECT, related_name="level_members")

    class Meta:
        unique_together = ("member", "project")

class Workflow(models.Model):
    name = models.CharField(max_length=15)