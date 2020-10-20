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
    render() {
        
    };
}

class Project extends React.Component {
    constructor(props) {
        super(props);
        // I need to check the div for which project I'm loading so I can fetch the
        // correct deadlines
        this.state = {
            section: "deadlines"
        };
    }

    selectDeadline(id) {
        // change the state to the deadline with id and change the visible
        // div to the tasks within that deadline
    }

    selectTask(id) {
        // change the state to the task with id and change the visible 
        // div to the id with information
    }
}

function GetTasks(deadline_id) {

}