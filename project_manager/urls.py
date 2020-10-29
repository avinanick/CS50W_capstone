from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("create_deadline", views.create_deadline, name="create_deadline"),
    path("create_project", views.create_project, name="create_project"),
    path("create_task", views.create_task, name="create_task"),
    path("get_projects", views.projects, name="get_projects"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("update_task", views.update_task, name="update_task"),
    path("authority/<int:project_id>", views.authority, name="authority"),
    path("get_deadlines/<int:project_id>", views.deadlines, name="get_deadlines"),
    path("get_tasks/<int:project_id>/<int:deadline_id>", views.tasks, name="get_tasks"),
    path("members/<int:project_id>", views.members, name="members"),
    path("project/<int:project_id>", views.project, name="view_project")
]