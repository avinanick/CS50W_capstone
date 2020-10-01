from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, "index"),
    path("login", views.login, "login"),
    path("logout", views.logout, "logout"),
    path("register", views.register, "register")
]