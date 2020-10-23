from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("create_project", views.create_project, name="create_project"),
    path("get_projects", views.projects, name="get_projects"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("get_deadlines/<int:project_id>", views.deadlines, name="get_deadlines"),
    path("project/<int:project_id>", views.project, name="view_project")
]