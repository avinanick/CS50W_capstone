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
        this.setState({date: event.target.value})
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
        for(let i=0; i < this.props.project_deadlines; i++) {
            deadline_options.push(deadlineOption(this.props.project_deadlines[i]));
        }
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
        return (
            <div className="deadline-container" onClick={() => this.props.onClick(deadline_json.id)} key={deadline_json.id}>
                Deadline: {deadline_json.date}
            </div>
        );
    }

    render() {

        if(this.props.deadlines.length > 0) {
            const items = []

            for(let i=0; i < this.props.deadlines.length; i++) {
                items.push(this.renderDeadline(this.props.deadlines[i]));
            }

            return (
                <div>
                    {items}
                    <div className="deadline-container" onClick={() => this.props.onClick(-1)} key="-1">
                        Unsortted
                    </div>
                </div>
            );
        }
        else {
            return <div></div>;
        }
            
    };
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
            deadline_tasks: []
        };
        this.selectDeadline = this.selectDeadline.bind(this);
        this.selectTask = this.selectTask.bind(this);
        this.updateDeadlines = this.updateDeadlines.bind(this);
        let project_root = document.getElementById("project-root");
        this.state.project_id = project_root.dataset.projectid;
        this.updateDeadlines();
    }

    hideDeadlineForm() {
        let hide_form = document.querySelector("#deadline-form");
        if(hide_form) {
            hide_form.style.display = "none";
        }
    }

    hideTaskForm() {
        let hide_form = document.querySelector('#task-form');
        if(hide_form) {
            hide_form.style.display = "none";
        }
    }

    openDeadlineForm() {
        document.querySelector("#deadline-form").style.display = "block";
    }

    openTaskForm() {
        document.querySelector("task-form").style.display = "block";
    }

    selectDeadline(id) {
        // change the state to the deadline with id and change the visible
        // div to the tasks within that deadline
        this.setState({section: {
            id: id,
            state: "tasks"
        }});
    }

    selectTask(id) {
        // change the state to the task with id and change the visible 
        // div to the id with information
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

    render() {
        // This should check what state the page is in, and render
        // as appropriate
        // I need to make the bottom bar section next, and likely move
        // the if statement before the return
        if(this.state.section.state === "deadlines") {
            return (
                <div>
                    <DeadlineList
                    deadlines={this.state.project_deadlines}
                    onClick={i => this.selectDeadline(i)}
                    />
                    <CreateDeadlineForm 
                    project_id={this.state.project_id}
                    onSubmit={this.updateDeadlines}
                    cancel_response={this.hideDeadlineForm}
                    />
                    <CreateTaskForm 
                    project_id={this.state.project_id}
                    project_deadlines={this.state.project_deadlines}
                    onSubmit={this.hideDeadlineForm} // will likely change this to an update tasks later
                    cancel_response={this.hideDeadlineForm}
                    />
                    <ProjectTaskbar 
                    deadline_click={this.openDeadlineForm}
                    />
                </div>
            );
        }
        else {
            return (
                <div>
                    <CreateDeadlineForm 
                    project_id={this.state.project_id}
                    onSubmit={this.updateDeadlines}
                    cancel_response={this.hideDeadlineForm}
                    />
                    <CreateTaskForm 
                    project_id={this.state.project_id}
                    project_deadlines={this.state.project_deadlines}
                    onSubmit={this.hideDeadlineForm} // will likely change this to an update tasks later
                    cancel_response={this.hideDeadlineForm}
                    />
                    <ProjectTaskbar 
                    deadline_click={this.openDeadlineForm}
                    task_click={this.openTaskForm}
                    />
                </div>
            );
        }
    }
}

class ProjectTaskbar extends React.Component {
    render() {
        return(
            <div className='bottom-taskbar'>
                <button className="btn btn-light" onClick={this.props.deadline_click}>Create Deadline</button>
                <button className="btn btn-light" onClick={this.props.task_click}>Create Task</button>
            </div>
        );
    }
}

function GetTasks(deadline_id) {

}

// =========================================================================

document.addEventListener('DOMContentLoaded', function() {

    ReactDOM.render(<Project />, document.getElementById("project-root"));

});