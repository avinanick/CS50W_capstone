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
        fetch('get_deadlines', {
            method: "GET",
            body: JSON.stringify({
                project_id: this.state.project_id
            })
        })
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
        if(this.state.section.state === "deadlines") {
            return (
                <DeadLineList
                    deadlines={this.state.project_deadlines}
                    onClick={i => this.selectDeadline(i)}
                />
            );
        }
    }
}

function GetTasks(deadline_id) {

}

// =========================================================================

ReactDOM.render(<Project />, document.getElementById("project-root"));