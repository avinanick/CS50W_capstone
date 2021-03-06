'use strict';

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

class CreateDeadlineForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            linked_project: this.props.project_id,
            date: new Date(Date.now())
        }

        // This should get the currently open project to auto assign
        // the linked project field
        this.submit_response = this.submit_response.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        let new_date = new Date(event.target.value);
        this.setState({date: new_date})
    }

    submit_response(event) {
        event.preventDefault();

        // send the create deadline request to the backend then call the prop
        // on submit function (which will likely just be update deadlines)
        const csrftoken = getCookie('csrftoken');

        fetch('/create_deadline', {
        headers: {'X-CSRFToken': csrftoken},
        method: 'POST',
        body: JSON.stringify({
            //content: post_content
            project_id: parseInt(this.state.linked_project),
            year: this.state.date.getFullYear(),
            month: this.state.date.getMonth(),
            day: this.state.date.getDay()
            })
        })
        .then(response => {
            console.log(response);
            this.props.onSubmit();
        })
    }

    render() {
        return (
            <div className="overlay-form" id="deadline-form">
                <form onSubmit={this.submit_response} >
                    <h3>Create Deadline</h3>
                    <input type="datetime-local" className="date-input" name="date" onChange={this.handleChange} />
                    <button type="submit" className="btn btn-primary">Submit</button>
                    <button type="button" className="btn btn-primary" onClick={this.props.cancel_response}>Cancel</button>
                </form>
            </div>
        );
    }
}

class CreateTaskForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            linked_project: parseInt(this.props.project_id),
            title: "",
            description: "",
            linked_deadline: -1
        }

        this.submit_response = this.submit_response.bind(this);
        this.deadlineChanged = this.deadlineChanged.bind(this);
        this.descriptionChanged = this.descriptionChanged.bind(this);
        this.titleChanged = this.titleChanged.bind(this);
    }

    deadlineChanged(event) {
        this.setState({linked_deadline: parseInt(event.target.value)});
    }

    deadlineOption(deadline_json) {
        return (
            <option value={deadline_json.id} key={deadline_json.id}>{deadline_json.date}</option>
        );
    }

    descriptionChanged(event) {
        this.setState({description: event.target.value});
    }

    submit_response(event) {
        event.preventDefault();

        const csrftoken = getCookie('csrftoken');

        fetch('/create_task', {
        headers: {'X-CSRFToken': csrftoken},
        method: 'POST',
        body: JSON.stringify({
            //content: post_content
            project_id: parseInt(this.state.linked_project),
            title: this.state.title,
            description: this.state.description,
            deadline_id: this.state.linked_deadline
            })
        })
        .then(response => {
            console.log(response);
            this.props.onSubmit();
        })
    }

    titleChanged(event) {
        this.setState({title: event.target.value});
    }

    render() {
        // Need to figure out the deadline select
        let deadline_options = [];
        for(let i=0; i < this.props.project_deadlines.length; i++) {
            deadline_options.push(this.deadlineOption(this.props.project_deadlines[i]));
        }
        //console.log(deadline_options);
        return (
            <div className="overlay-form" id="task-form">
                <form onSubmit={this.submit_response} >
                    <h3>Create Task</h3>
                    <input type="text" name="task-title" id="task-title" placeholder="Task Title" maxLength="1024" onChange={this.titleChanged} />
                    <input type="text" name="task-description" id="task-description" placeholder="Task Description" onChange={this.descriptionChanged} />
                    <select name="deadlines" id="deadlines" onChange={this.deadlineChanged}>
                        {deadline_options}
                        <option value="-1">None</option>
                    </select>
                    <button type="submit" className="btn btn-primary">Submit</button>
                    <button type="button" className="btn btn-primary" onClick={this.props.cancel_response}>Cancel</button>
                </form>
            </div>
        );
    }
}

class DeadlineList extends React.Component {
    renderDeadline(deadline_json) {
        console.log(deadline_json.id);
        let deadline_id_name = "deadline-" + deadline_json.id;
        return (
            <div id={deadline_id_name} className="deadline-container" onClick={() => this.props.onClick(deadline_json.id)} key={deadline_json.id}>
                Deadline: {deadline_json.date}
            </div>
        );
    }

    render() {

        let items=[];

        for(let i=0; i < this.props.deadlines.length; i++) {
            items.push(this.renderDeadline(this.props.deadlines[i]));
        }

        return (
            <div>
                {items}
                <div className="deadline-container" onClick={() => this.props.onClick(0)} key="-1">
                    Unsorted
                </div>
            </div>
        );
            
    };
}

class EditTaskForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            linked_project: parseInt(this.props.project_id),
            title: this.props.task.title,
            description: this.props.task.description,
            linked_deadline: this.props.task.deadline_id
        }

        this.deadlineChanged = this.deadlineChanged.bind(this);
        this.descriptionChanged = this.descriptionChanged.bind(this);
        this.titleChanged = this.titleChanged.bind(this);
        this.submit_response = this.submit_response.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({title: nextProps.task.title});
        this.setState({description: nextProps.task.description});
        this.setState({linked_deadline: nextProps.task.deadline_id});
    }

    deadlineChanged(event) {
        this.setState({linked_deadline: parseInt(event.target.value)});
    }

    deadlineOption(deadline_json) {
        return (
            <option value={deadline_json.id} key={deadline_json.id}>{deadline_json.date}</option>
        );
    }

    descriptionChanged(event) {
        this.setState({description: event.target.value});
    }

    submit_response(event) {
        event.preventDefault();

        const csrftoken = getCookie('csrftoken');

        fetch('/update_task', {
        headers: {'X-CSRFToken': csrftoken},
        method: 'POST',
        body: JSON.stringify({
            //content: post_content
            task_id: parseInt(this.props.task.id),

            title: this.state.title,
            description: this.state.description,
            deadline_id: parseInt(this.state.linked_deadline)
            })
        })
        .then(response => {
            console.log(response);
            this.props.onSubmit();
        })
    }

    titleChanged(event) {
        this.setState({title: event.target.value});
    }

    render() {
        // Need to figure out the deadline select
        let deadline_options = [];
        for(let i=0; i < this.props.project_deadlines.length; i++) {
            deadline_options.push(this.deadlineOption(this.props.project_deadlines[i]));
        }

        return (
            <div className="overlay-form" id="update-task-form">
                <form onSubmit={this.submit_response} >
                    <h3>Edit Task</h3>
                    <input type="text" name="task-title" id="task-title" placeholder="Task Title" maxLength="1024" onChange={this.titleChanged} value={this.state.title}/>
                    <input type="text" name="task-description" id="task-description" placeholder="Task Description" onChange={this.descriptionChanged} value={this.state.description}/>
                    <select name="deadlines" id="deadlines" onChange={this.deadlineChanged} value={this.state.linked_deadline}>
                        {deadline_options}
                        <option value="0">None</option>
                    </select>
                    <button type="submit" className="btn btn-primary">Submit</button>
                    <button type="button" className="btn btn-primary" onClick={this.props.cancel_response}>Cancel</button>
                </form>
            </div>
        );
    }
}

class Project extends React.Component {
    constructor(props) {
        super(props);
        // I need to check the div for which project I'm loading so I can fetch the
        // correct deadlines
        this.state = {
            project_id: 0,
            section: {
                state: "deadlines",
                id: 0
            },
            project_deadlines: [],
            deadline_tasks: [],
            selected_task: {},
            authority_level: ""
        };
        this.selectDeadline = this.selectDeadline.bind(this);
        this.selectTask = this.selectTask.bind(this);
        this.updateDeadlines = this.updateDeadlines.bind(this);
        this.updateTasks = this.updateTasks.bind(this);
        this.exitTasksView = this.exitTasksView.bind(this);
        let project_root = document.getElementById("project-root");
        this.state.project_id = project_root.dataset.projectid;
        this.updateDeadlines();
        this.getAuthority();
    }

    exitTasksView() {
        this.setState({section: {
            id: 0,
            state: "deadlines"
        }});
    }

    getAuthority() {
        fetch("/authority/" + this.state.project_id)
        .then(response => response.json())
        .then(auth => {
            console.log(auth);
            this.setState({authority_level: auth.auth_level});
        })
    }

    hideDeadlineForm() {
        let hide_form = document.querySelector("#deadline-form");
        if(hide_form) {
            hide_form.style.display = "none";
        }
    }

    hideEditForm() {
        let hide_form = document.querySelector("#update-task-form");
        if(hide_form) {
            hide_form.style.display = "none";
        }
    }

    hideMembershipForm() {
        let hide_form = document.querySelector("#memberships-form");
        if(hide_form) {
            hide_form.style.display = "none";
        }
    }

    hideTaskForm() {
        let hide_form = document.querySelector('#task-form');
        if(hide_form) {
            hide_form.style.display = "none";
        }
        this.updateTasks(this.state.section.id);
    }

    openDeadlineForm() {
        document.querySelector("#deadline-form").style.display = "block";
    }

    openMembershipForm() {
        document.querySelector("#memberships-form").style.display = "block";
    }

    openTaskForm() {
        document.querySelector("#task-form").style.display = "block";
    }

    selectDeadline(id) {
        // change the state to the deadline with id and change the visible
        // div to the tasks within that deadline
        this.setState({section: {
            id: id,
            state: "tasks"
        }});
        this.updateTasks(id);
    }

    selectTask(task_json) {
        // change the state to the task with id and change the visible 
        // div to the id with information
        this.setState({selected_task: task_json});
        console.log("Selecting task linked to " + task_json.deadline_id);
        document.querySelector("#update-task-form").style.display = "block";
    }

    updateDeadlines() {
        this.hideDeadlineForm();
        fetch('/get_deadlines/' + this.state.project_id)
        .then(response => response.json())
        .then(deadlines => {

            let deadlines_list = [];

            for(let i=0; i < deadlines.deadlines.length; i++) {
                
                deadlines_list = deadlines_list.concat([{
                    date: deadlines.deadlines[i].date,
                    id: deadlines.deadlines[i].id
                }]);

            }

            this.setState({project_deadlines: deadlines_list});

        })
    }

    updateTasks(deadline_id) {
        // if the current state section id is greater than 0, get the 
        // tasks that go with that deadline id, otherwise do nothing
        fetch('/get_tasks/' + this.state.project_id + '/' + deadline_id)
        .then(response => response.json())
        .then(tasks => {

            let tasks_list = [];

            for(let i=0; i < tasks.tasks.length; i++) {
                
                tasks_list = tasks_list.concat([{
                    title: tasks.tasks[i].title,
                    id: tasks.tasks[i].id,
                    date_created: tasks.tasks[i].date_created,
                    description: tasks.tasks[i].description,
                    flow_status: tasks.tasks[i].flow_status,
                    creator: tasks.tasks[i].creator,
                    deadline_id: tasks.tasks[i].deadline_id
                }]);

            }

            this.setState({deadline_tasks: tasks_list});

        })
    }

    render() {
        // This should check what state the page is in, and render
        // as appropriate
        // I need to make the bottom bar section next, and likely move
        // the if statement before the return
        if(this.state.authority_level === "none") {
            return (
                <div>
                    Error: User not authorized for project.
                </div>
            );
        }

        let main_body = [];
        if(this.state.section.state === "deadlines") {
            main_body.push(<DeadlineList
                deadlines={this.state.project_deadlines}
                onClick={this.selectDeadline}
                />);
        }
        else {
            main_body.push(<TasksBoard 
                tasks={this.state.deadline_tasks}
                exitTasks={this.exitTasksView}
                task_click={this.selectTask}
                />);
        }

        // Need to double check if this is the actual authority level name
        if(this.state.authority_level != "Member") {
            main_body.push(<ManageUsers 
                authority_level={this.state.authority_level}
                close_form={this.hideMembershipForm}
                project_id={this.state.project_id}
                />);
        }

        return (
            <div>
                {main_body}

                <CreateDeadlineForm 
                project_id={this.state.project_id}
                onSubmit={this.updateDeadlines}
                cancel_response={this.hideDeadlineForm}
                />

                <CreateTaskForm 
                project_id={this.state.project_id}
                project_deadlines={this.state.project_deadlines}
                onSubmit={this.hideTaskForm}
                cancel_response={this.hideTaskForm}
                />

                <EditTaskForm 
                project_id={this.state.project_id}
                project_deadlines={this.state.project_deadlines}
                task={this.state.selected_task}
                onSubmit={this.hideEditForm}
                cancel_response={this.hideEditForm}
                />

                <ProjectTaskbar 
                deadline_click={this.openDeadlineForm}
                task_click={this.openTaskForm}
                authority_level={this.state.authority_level}
                member_click={this.openMembershipForm}
                />
            </div>
        );
    }
}

class ProjectTaskbar extends React.Component {
    render() {
        let member_button = [];
        if(this.props.authority_level != "Member") {
            member_button.push(<button 
                className="btn btn-light" 
                onClick={this.props.member_click}>
                    Edit Members
                </button>);
        }
        return(
            <div className='bottom-taskbar'>
                <button className="btn btn-light" onClick={this.props.deadline_click}>Create Deadline</button>
                {member_button}
                <button className="btn btn-light" onClick={this.props.task_click}>Create Task</button>
            </div>
        );
    }
}

class ManageUsers extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            managers: [],
            members: [],
            entered_username: "",
            selected_member: "",
            selected_manager: ""
        }

        this.editUsers = this.editUsers.bind(this);
        this.updateUsers = this.updateUsers.bind(this);
        this.onManagerChange = this.onManagerChange.bind(this);
        this.onMemberChange = this.onMemberChange.bind(this);
        this.onUsernameChange = this.onUsernameChange.bind(this);
        this.updateUsers();
    }

    editUsers(username, edit_type) {

        const csrftoken = getCookie('csrftoken');

        fetch('/members/' + this.props.project_id, {
        headers: {'X-CSRFToken': csrftoken},
        method: 'POST',
        body: JSON.stringify({
            //content: post_content
            username: username,
            member_edit: edit_type
            })
        })
        .then(response => {
            console.log(response);
            this.updateUsers();
        })
        
    }

    onManagerChange(event) {
        this.setState({selected_manager: event.target.value});
    }

    onMemberChange(event) {
        this.setState({selected_member: event.target.value});
    }

    onUsernameChange(event) {
        this.setState({entered_username: event.target.value});
    }

    updateUsers() {
        fetch("/members/" + this.props.project_id)
        .then(response => response.json())
        .then(members => {
            console.log(members);

            let update_managers = [];
            let update_members = [];

            for(let i=0; i < members.members.length; i++) {
                if(members.members[i].authority === "Manager") {
                    update_managers.push(members.members[i].name);
                }
                if(members.members[i].authority === "Member") {
                    update_members.push(members.members[i].name);
                }
            }

            this.setState({managers: update_managers});
            this.setState({members: update_members});
            if(update_members.length > 0) {
                this.setState({selected_member: update_members[0]});
            }
            if(update_managers.length > 0) {
                this.setState({selected_manager: update_managers[0]});
            }
        })
    }

    renderManagersSelect() {
        // If the user isn't the owner, they shouldn't be able
        // to modify any managers
        if(this.props.authority_level != "Owner") {
            return (<div></div>);
        }
        let managerslist = [];

        for(let i=0; i<this.state.managers.length; i++) {
            managerslist.push(this.renderOption(this.state.managers[i]));
        }

        return (
            <div>
                <label htmlFor="managers-select">Managers</label>
                <select name="managers" id="managers-select" onChange={this.onManagerChange} value={this.state.selected_manager}>
                    {managerslist}
                </select>
                <button type="button" className="btn btn-primary" onClick={() => this.editUsers(this.state.selected_manager, "demote")}>Demote</button>
                <button type="button" className="btn btn-primary" onClick={() => this.editUsers(this.state.selected_manager, "remove")}>Remove</button>
            </div>
        );
    }

    renderMembersSelect() {
        let memberslist = [];

        for(let i=0; i<this.state.members.length; i++) {
            memberslist.push(this.renderOption(this.state.members[i]));
        }

        let promote_button = [];
        if(this.props.authority_level === "Owner") {
            promote_button.push(<button type="button" className="btn btn-primary" onClick={() => this.editUsers(this.state.selected_member, "promote")}>Promote</button>);
        }

        return (
            <div>
                <label htmlFor="members-select">Members</label>
                <select name="members" id="members-select" onChange={this.onMemberChange} value={this.state.selected_member}>
                    {memberslist}
                </select>
                {promote_button}
                <button type="button" className="btn btn-primary" onClick={() => this.editUsers(this.state.selected_member, "remove")}>Remove</button>
            </div>
        );
    }

    renderOption(username) {
        return (
            <option value={username}>{username}</option>
        )
    }

    render() {

        return(
            <div className="overlay-form" id="memberships-form">
                <form>
                    <h3>Manage Users</h3>
                    <div className="">
                        <label htmlFor="member-invite" className="">Invite Member</label>
                        <input id="member-invite" className="" type="text" placeholder="Member name" value={this.state.entered_username} onChange={this.onUsernameChange}/>
                        <button type="button" className="btn btn-primary" onClick={() => this.editUsers(this.state.entered_username, "invite")}>Invite</button>
                    </div>
                    {this.renderManagersSelect()}
                    {this.renderMembersSelect()}
                    <button type="button" className="btn btn-primary" onClick={this.props.close_form}>Close</button>
                </form>
            </div>
        );
    }
}

class TasksBoard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dragged_task: -1
        }
    }

    allowDrop(event) {
        event.preventDefault();
    }

    drag(event, task_id) {
        event.dataTransfer.setData("text", event.target.id);
        this.state.dragged_task = task_id;
    }

    drop(event, new_flow) {
        event.preventDefault();
        let data = event.dataTransfer.getData("text");
        event.target.appendChild(document.getElementById(data));
        // This needs to be updated to send a put request to update
        // the task workflow
        console.log(new_flow);
        console.log(this.state.dragged_task);

        const csrftoken = getCookie('csrftoken');

        fetch('/update_task', {
        headers: {'X-CSRFToken': csrftoken},
        method: 'PUT',
        body: JSON.stringify({
            //content: post_content
            task_id: parseInt(this.state.dragged_task),
            workflow: new_flow
            })
        })
        .then(response => {
            console.log(response);
        })
    }

    renderTask(task_json) {
        let task_id = "task" + task_json.id;
        return (
            <div id={task_id} onClick={() => this.props.task_click(task_json)} className="task-display" draggable="true" key={task_json.id} onDragStart={(event) => this.drag(event, task_json.id)}>
                {task_json.title}
            </div>
        );
    }

    render() {
        // Update return to give custom headline
        let todo_tasks = [];
        let in_progress_tasks = [];
        let done_tasks = [];

        for(let i=0; i < this.props.tasks.length; i++) {
            if(this.props.tasks[i].flow_status === "To Do") {
                todo_tasks.push(this.renderTask(this.props.tasks[i]));
            }
            if(this.props.tasks[i].flow_status === "In Progress") {
                in_progress_tasks.push(this.renderTask(this.props.tasks[i]));
            }
            if(this.props.tasks[i].flow_status === "Done") {
                done_tasks.push(this.renderTask(this.props.tasks[i]));
            }
        }

        return (
            <div id="tasks-view">
                <h2>Tasks</h2>
                <div id="tasks-board">
                    <div className="task-col" id="todo-col" onDrop={(event) => this.drop(event, "To Do")} onDragOver={this.allowDrop}>
                        <h3>To Do</h3>
                        {todo_tasks}
                    </div>
                    <div className="task-col" id="progress-col" onDrop={(event) => this.drop(event, "In Progress")} onDragOver={this.allowDrop}>
                        <h3>In Progress</h3>
                        {in_progress_tasks}
                    </div>
                    <div className="task-col" id="done-col" onDrop={(event) => this.drop(event, "Done")} onDragOver={this.allowDrop}>
                        <h3>Done</h3>
                        {done_tasks}
                    </div>
                </div>
                <button type="button" className="btn btn-primary" onClick={this.props.exitTasks}>Deadlines</button>
            </div>
        );
    }
}

// =========================================================================

document.addEventListener('DOMContentLoaded', function() {

    ReactDOM.render(<Project />, document.getElementById("project-root"));

});