from django.contrib import admin
from .models import User, Project, Membership, Deadline, Task, Authority

# Register your models here.
admin.site.register(User)
admin.site.register(Project)
admin.site.register(Deadline)
admin.site.register(Task)
admin.site.register(Authority)
admin.site.register(Membership)
