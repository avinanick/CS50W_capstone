# Project Manager

## Description

This app is meant to give users a tool for managing tasks and deadlines for projects. Users can have various roles that grant them different permissions in a project. 

### Project Owner

When a user creates a project, they are automatically assigned the role of project owner to that project. They have the ability to invite or remove other users to work on the project, promote users to higher roles up to Group Manager, create release deadlines, and create and edit tasks.

### Group Manager

Group Managers are selected by the Project Owner. They have the ability to invite other users to the project, create release deadlines, and create and edit tasks.

### Group Member

Group Member is the default role when a new member is added to a project. They only have the authorization to create and edit tasks.

### Release Deadlines

Release Deadlines are set by either the Project Owner, or any Group Managers. Tasks are assigned to release deadlines.

### Tasks

Tasks are created by any member working on the project. Fields include a title, description, and work status which starts as To Do and can be updated to In Progress and Done.

### Activity Messages

On the index page, users will see a list of messages giving them updates about activity that has taken place in any projects they are a part of. Activity includes creating deadlines or tasks, and adding, removing, promoting, or demoting members of the project group.

## Contents

The project_manager/static/project_manager/src/ folder contains the source react/jsx code that was translated into regular javascript using babel, output files for this process share their name with the original file and are contained in the project_manager/static/project_manager/ folder.

All other files are the standard ones used in a django project, modifications were done mainly in the models.py, urls.py, views.py, and admin.py, with an edit in settings.py to make sure the user model works.

## Defense

For this project, in addition to using what we've learned throughout the course, I've used my own version of an authority/permissions model that will only allow users to access parts of the project that the user is meant to have access to. These permissions are unique to each project, so a user can have higher access in one project than another, or no access to a project at all. I've also used React, translated using babel into another javascript file that is then used for the main bulk of the javascript.