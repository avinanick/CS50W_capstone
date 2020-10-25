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

        fetch('/create_deadline/', {
        headers: {'X-CSRFToken': csrftoken},
        method: 'POST',
        body: JSON.stringify({
            //content: post_content
            project_id: this.state.project_id,
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
            <div className="overlay-form">
                <form onSubmit={this.submit_response} >
                    <h3>Create Deadline</h3>
                    <input type="datetime-local" className="date-input" name="date" onChange={this.handleChange} ></input>
                    <input type="submit">Submit</input>
                    <button>Cancel</button>
                </form>
            </div>
        );
    }
}

class DeadlineLink extends React.Component {
    render() {
        return  (
            <div>
                <a href="#"></a>
            </div>
        );
    }
}

class DeadlineList extends React.Component {
    renderDeadline(deadline_json) {
        return (
            <div className="deadline-container" onClick={this.props.onClick(deadline_json.id)}>
                Deadline: {deadline_json.date}
            </div>
        );
    }

    render() {

        const items = []

        for(const [index, value] of this.props.deadlines) {
            items.push(this.renderDeadline(value));
        }

        return (
            <div>
                {items}
            </div>
        );
            
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
        let project_root = document.getElementById("project-root");
        this.state.project_id = project_root.dataset.projectid;
        this.updateDeadlines();
    }

    selectDeadline(id) {
        // change the state to the deadline with id and change the visible
        // div to the tasks within that deadline
        this.state.section.state = "tasks";
        this.state.section.id = id;
    }

    selectTask(id) {
        // change the state to the task with id and change the visible 
        // div to the id with information
    }

    updateDeadlines() {
        fetch('/get_deadlines/' + this.state.project_id)
        .then(response => response.json())
        .then(deadlines => {

            console.log(deadlines);
            this.state.project_deadlines = [];
            for(let i=0; i < deadlines.deadlines.length; i++) {
                this.state.project_deadlines.concat([
                    {
                        date: deadlines.deadlines[i].date,
                        id: deadlines.deadlines[i].id
                    }
                ]);
            }

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
                    <ProjectTaskbar />
                </div>
            );
        }
    }
}

class ProjectTaskbar extends React.Component {
    render() {
        return(
            <div className='bottom-taskbar'>
                <button className="btn btn-light">Create Deadline</button>
                <button className="btn btn-light">Create Task</button>
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