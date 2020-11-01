# Project Manager

## Description

This app is meant to give users a tool for managing tasks and deadlines for projects. Users can have various roles that grant them different permissions in a project. 

### Project Owner

When a user creates a project, they are automatically assigned the role of project owner to that project. They have the ability to invite or remove other users to work on the project, promote users to higher roles up to Group Manager, create and edit release deadlines, and create and edit tasks.

### Group Manager

Group Managers are selected by the Project Owner. They have the ability to invite other users to the project, create and edit release deadlines, and create and edit tasks.

### Group Member

Group Member is the default role when a new member is added to a project. They only have the authorization to create and edit tasks.

### Release Deadlines

Release Deadlines are set and edited by either the Project Owner, or any Group Managers. Tasks are assigned to release deadlines.

### Tasks

Tasks are created by any member working on the project. Fields include a title, description, and work status which starts as To Do and can be updated to In Progress and Done.

### Activity Messages

On the index page, users will see a list of messages giving them updates about activity that has taken place in any projects they are a part of. Activity includes creating deadlines or tasks, and adding, removing, promoting, or demoting members of the project group.

## Contents

The project_manager/static/project_manager/src/ folder contains the source react/jsx code that was translated into regular javascript using babel, output files for this process share their name with the original file and are contained in the project_manager/static/project_manager/ folder.

## Defense