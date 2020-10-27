'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === name + '=') {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

var CreateDeadlineForm = function (_React$Component) {
    _inherits(CreateDeadlineForm, _React$Component);

    function CreateDeadlineForm(props) {
        _classCallCheck(this, CreateDeadlineForm);

        var _this = _possibleConstructorReturn(this, (CreateDeadlineForm.__proto__ || Object.getPrototypeOf(CreateDeadlineForm)).call(this, props));

        _this.state = {
            linked_project: _this.props.project_id,
            date: new Date(Date.now())

            // This should get the currently open project to auto assign
            // the linked project field
        };_this.submit_response = _this.submit_response.bind(_this);
        _this.handleChange = _this.handleChange.bind(_this);
        return _this;
    }

    _createClass(CreateDeadlineForm, [{
        key: 'handleChange',
        value: function handleChange(event) {
            this.setState({ date: event.target.value });
        }
    }, {
        key: 'submit_response',
        value: function submit_response(event) {
            var _this2 = this;

            event.preventDefault();

            // send the create deadline request to the backend then call the prop
            // on submit function (which will likely just be update deadlines)
            var csrftoken = getCookie('csrftoken');

            fetch('/create_deadline', {
                headers: { 'X-CSRFToken': csrftoken },
                method: 'POST',
                body: JSON.stringify({
                    //content: post_content
                    project_id: parseInt(this.state.linked_project),
                    year: this.state.date.getFullYear(),
                    month: this.state.date.getMonth(),
                    day: this.state.date.getDay()
                })
            }).then(function (response) {
                console.log(response);
                _this2.props.onSubmit();
            });
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { className: 'overlay-form', id: 'deadline-form' },
                React.createElement(
                    'form',
                    { onSubmit: this.submit_response },
                    React.createElement(
                        'h3',
                        null,
                        'Create Deadline'
                    ),
                    React.createElement('input', { type: 'datetime-local', className: 'date-input', name: 'date', onChange: this.handleChange }),
                    React.createElement(
                        'button',
                        { type: 'submit', className: 'btn btn-primary' },
                        'Submit'
                    ),
                    React.createElement(
                        'button',
                        { type: 'button', className: 'btn btn-primary', onClick: this.props.cancel_response },
                        'Cancel'
                    )
                )
            );
        }
    }]);

    return CreateDeadlineForm;
}(React.Component);

var CreateTaskForm = function (_React$Component2) {
    _inherits(CreateTaskForm, _React$Component2);

    function CreateTaskForm(props) {
        _classCallCheck(this, CreateTaskForm);

        var _this3 = _possibleConstructorReturn(this, (CreateTaskForm.__proto__ || Object.getPrototypeOf(CreateTaskForm)).call(this, props));

        _this3.state = {
            linked_project: parseInt(_this3.props.project_id),
            title: "",
            description: "",
            linked_deadline: -1
        };

        _this3.submit_response = _this3.submit_response.bind(_this3);
        _this3.deadlineChanged = _this3.deadlineChanged.bind(_this3);
        _this3.descriptionChanged = _this3.descriptionChanged.bind(_this3);
        _this3.titleChanged = _this3.titleChanged.bind(_this3);
        return _this3;
    }

    _createClass(CreateTaskForm, [{
        key: 'deadlineChanged',
        value: function deadlineChanged(event) {
            this.setState({ linked_deadline: parseInt(event.target.value) });
        }
    }, {
        key: 'deadlineOption',
        value: function deadlineOption(deadline_json) {
            return React.createElement(
                'option',
                { value: deadline_json.id, key: deadline_json.id },
                deadline_json.date
            );
        }
    }, {
        key: 'descriptionChanged',
        value: function descriptionChanged(event) {
            this.setState({ description: event.target.value });
        }
    }, {
        key: 'submit_response',
        value: function submit_response(event) {
            var _this4 = this;

            event.preventDefault();

            var csrftoken = getCookie('csrftoken');

            fetch('/create_task', {
                headers: { 'X-CSRFToken': csrftoken },
                method: 'POST',
                body: JSON.stringify({
                    //content: post_content
                    project_id: parseInt(this.state.linked_project),
                    title: this.state.title,
                    description: this.state.description,
                    deadline_id: this.state.linked_deadline
                })
            }).then(function (response) {
                console.log(response);
                _this4.props.onSubmit();
            });
        }
    }, {
        key: 'titleChanged',
        value: function titleChanged(event) {
            this.setState({ title: event.target.value });
        }
    }, {
        key: 'render',
        value: function render() {
            // Need to figure out the deadline select
            var deadline_options = [];
            for (var i = 0; i < this.props.project_deadlines.length; i++) {
                deadline_options.push(this.deadlineOption(this.props.project_deadlines[i]));
            }
            //console.log(deadline_options);
            return React.createElement(
                'div',
                { className: 'overlay-form', id: 'task-form' },
                React.createElement(
                    'form',
                    { onSubmit: this.submit_response },
                    React.createElement(
                        'h3',
                        null,
                        'Create Task'
                    ),
                    React.createElement('input', { type: 'text', name: 'task-title', id: 'task-title', placeholder: 'Task Title', maxLength: '1024', onChange: this.titleChanged }),
                    React.createElement('input', { type: 'text', name: 'task-description', id: 'task-description', placeholder: 'Task Description', onChange: this.descriptionChanged }),
                    React.createElement(
                        'select',
                        { name: 'deadlines', id: 'deadlines', onChange: this.deadlineChanged },
                        deadline_options,
                        React.createElement(
                            'option',
                            { value: '-1' },
                            'None'
                        )
                    ),
                    React.createElement(
                        'button',
                        { type: 'submit', className: 'btn btn-primary' },
                        'Submit'
                    ),
                    React.createElement(
                        'button',
                        { type: 'button', className: 'btn btn-primary', onClick: this.props.cancel_response },
                        'Cancel'
                    )
                )
            );
        }
    }]);

    return CreateTaskForm;
}(React.Component);

var DeadlineList = function (_React$Component3) {
    _inherits(DeadlineList, _React$Component3);

    function DeadlineList() {
        _classCallCheck(this, DeadlineList);

        return _possibleConstructorReturn(this, (DeadlineList.__proto__ || Object.getPrototypeOf(DeadlineList)).apply(this, arguments));
    }

    _createClass(DeadlineList, [{
        key: 'renderDeadline',
        value: function renderDeadline(deadline_json) {
            var _this6 = this;

            return React.createElement(
                'div',
                { className: 'deadline-container', onClick: function onClick() {
                        return _this6.props.onClick(deadline_json.id);
                    }, key: deadline_json.id },
                'Deadline: ',
                deadline_json.date
            );
        }
    }, {
        key: 'render',
        value: function render() {
            var _this7 = this;

            if (this.props.deadlines.length > 0) {
                var items = [];

                for (var i = 0; i < this.props.deadlines.length; i++) {
                    items.push(this.renderDeadline(this.props.deadlines[i]));
                }

                return React.createElement(
                    'div',
                    null,
                    items,
                    React.createElement(
                        'div',
                        { className: 'deadline-container', onClick: function onClick() {
                                return _this7.props.onClick(-1);
                            }, key: '-1' },
                        'Unsorted'
                    )
                );
            } else {
                return React.createElement('div', null);
            }
        }
    }]);

    return DeadlineList;
}(React.Component);

var Project = function (_React$Component4) {
    _inherits(Project, _React$Component4);

    function Project(props) {
        _classCallCheck(this, Project);

        // I need to check the div for which project I'm loading so I can fetch the
        // correct deadlines
        var _this8 = _possibleConstructorReturn(this, (Project.__proto__ || Object.getPrototypeOf(Project)).call(this, props));

        _this8.state = {
            project_id: 0,
            section: {
                state: "deadlines",
                id: 0
            },
            project_deadlines: [],
            deadline_tasks: []
        };
        _this8.selectDeadline = _this8.selectDeadline.bind(_this8);
        _this8.selectTask = _this8.selectTask.bind(_this8);
        _this8.updateDeadlines = _this8.updateDeadlines.bind(_this8);
        _this8.updateTasks = _this8.updateTasks.bind(_this8);
        _this8.exitTasksView = _this8.exitTasksView.bind(_this8);
        var project_root = document.getElementById("project-root");
        _this8.state.project_id = project_root.dataset.projectid;
        _this8.updateDeadlines();
        return _this8;
    }

    _createClass(Project, [{
        key: 'exitTasksView',
        value: function exitTasksView() {
            this.setState({ section: {
                    id: 0,
                    state: "deadlines"
                } });
        }
    }, {
        key: 'hideDeadlineForm',
        value: function hideDeadlineForm() {
            var hide_form = document.querySelector("#deadline-form");
            if (hide_form) {
                hide_form.style.display = "none";
            }
        }
    }, {
        key: 'hideTaskForm',
        value: function hideTaskForm() {
            var hide_form = document.querySelector('#task-form');
            if (hide_form) {
                hide_form.style.display = "none";
            }
            this.updateTasks(this.state.section.id);
        }
    }, {
        key: 'openDeadlineForm',
        value: function openDeadlineForm() {
            document.querySelector("#deadline-form").style.display = "block";
        }
    }, {
        key: 'openTaskForm',
        value: function openTaskForm() {
            document.querySelector("#task-form").style.display = "block";
        }
    }, {
        key: 'selectDeadline',
        value: function selectDeadline(id) {
            // change the state to the deadline with id and change the visible
            // div to the tasks within that deadline
            this.setState({ section: {
                    id: id,
                    state: "tasks"
                } });
            this.updateTasks(id);
        }
    }, {
        key: 'selectTask',
        value: function selectTask(id) {
            // change the state to the task with id and change the visible 
            // div to the id with information
        }
    }, {
        key: 'updateDeadlines',
        value: function updateDeadlines() {
            var _this9 = this;

            this.hideDeadlineForm();
            fetch('/get_deadlines/' + this.state.project_id).then(function (response) {
                return response.json();
            }).then(function (deadlines) {

                var deadlines_list = [];

                for (var i = 0; i < deadlines.deadlines.length; i++) {

                    deadlines_list = deadlines_list.concat([{
                        date: deadlines.deadlines[i].date,
                        id: deadlines.deadlines[i].id
                    }]);
                }

                _this9.setState({ project_deadlines: deadlines_list });
            });
        }
    }, {
        key: 'updateTasks',
        value: function updateTasks(deadline_id) {
            var _this10 = this;

            // if the current state section id is greater than 0, get the 
            // tasks that go with that deadline id, otherwise do nothing
            fetch('/get_tasks/' + this.state.project_id + '/' + this.state.section.id).then(function (response) {
                return response.json();
            }).then(function (tasks) {

                console.log(tasks);

                var tasks_list = [];

                for (var i = 0; i < tasks.tasks.length; i++) {

                    tasks_list = tasks_list.concat([{
                        title: tasks.tasks[i].title,
                        id: tasks.tasks[i].id,
                        date_created: tasks.tasks[i].date_created,
                        description: tasks.tasks[i].description,
                        flow_status: tasks.tasks[i].flow_status,
                        creator: tasks.tasks[i].creator
                    }]);
                }

                _this10.setState({ deadline_tasks: tasks_list });
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this11 = this;

            // This should check what state the page is in, and render
            // as appropriate
            // I need to make the bottom bar section next, and likely move
            // the if statement before the return
            if (this.state.section.state === "deadlines") {
                return React.createElement(
                    'div',
                    null,
                    React.createElement(DeadlineList, {
                        deadlines: this.state.project_deadlines,
                        onClick: function onClick(i) {
                            return _this11.selectDeadline(i);
                        }
                    }),
                    React.createElement(CreateDeadlineForm, {
                        project_id: this.state.project_id,
                        onSubmit: this.updateDeadlines,
                        cancel_response: this.hideDeadlineForm
                    }),
                    React.createElement(CreateTaskForm, {
                        project_id: this.state.project_id,
                        project_deadlines: this.state.project_deadlines,
                        onSubmit: this.hideTaskForm,
                        cancel_response: this.hideTaskForm
                    }),
                    React.createElement(ProjectTaskbar, {
                        deadline_click: this.openDeadlineForm,
                        task_click: this.openTaskForm
                    })
                );
            } else {
                return React.createElement(
                    'div',
                    null,
                    React.createElement(TasksBoard, {
                        tasks: this.state.deadline_tasks,
                        exitTasks: this.exitTasksView
                    }),
                    React.createElement(CreateDeadlineForm, {
                        project_id: this.state.project_id,
                        onSubmit: this.updateDeadlines,
                        cancel_response: this.hideDeadlineForm
                    }),
                    React.createElement(CreateTaskForm, {
                        project_id: this.state.project_id,
                        project_deadlines: this.state.project_deadlines,
                        onSubmit: this.hideTaskForm,
                        cancel_response: this.hideTaskForm
                    }),
                    React.createElement(ProjectTaskbar, {
                        deadline_click: this.openDeadlineForm,
                        task_click: this.openTaskForm
                    })
                );
            }
        }
    }]);

    return Project;
}(React.Component);

var ProjectTaskbar = function (_React$Component5) {
    _inherits(ProjectTaskbar, _React$Component5);

    function ProjectTaskbar() {
        _classCallCheck(this, ProjectTaskbar);

        return _possibleConstructorReturn(this, (ProjectTaskbar.__proto__ || Object.getPrototypeOf(ProjectTaskbar)).apply(this, arguments));
    }

    _createClass(ProjectTaskbar, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { className: 'bottom-taskbar' },
                React.createElement(
                    'button',
                    { className: 'btn btn-light', onClick: this.props.deadline_click },
                    'Create Deadline'
                ),
                React.createElement(
                    'button',
                    { className: 'btn btn-light', onClick: this.props.task_click },
                    'Create Task'
                )
            );
        }
    }]);

    return ProjectTaskbar;
}(React.Component);

var TasksBoard = function (_React$Component6) {
    _inherits(TasksBoard, _React$Component6);

    function TasksBoard() {
        _classCallCheck(this, TasksBoard);

        return _possibleConstructorReturn(this, (TasksBoard.__proto__ || Object.getPrototypeOf(TasksBoard)).apply(this, arguments));
    }

    _createClass(TasksBoard, [{
        key: 'allowDrop',
        value: function allowDrop(event) {
            event.preventDefault();
        }
    }, {
        key: 'drag',
        value: function drag(event) {
            event.dataTransfer.setData("text", event.target.id);
        }
    }, {
        key: 'drop',
        value: function drop(event, new_flow) {
            event.preventDefault();
            var data = event.dataTransfer.getData("text");
            event.target.appendChild(document.getElementById(data));
            // This needs to be updated to send a put request to update
            // the task workflow
            console.log(new_flow);
        }
    }, {
        key: 'renderTask',
        value: function renderTask(task_json) {
            return React.createElement(
                'div',
                { className: 'task-display', draggable: 'true', key: task_json.id, onDragStart: this.drag },
                task_json.title
            );
        }
    }, {
        key: 'render',
        value: function render() {
            var _this14 = this;

            // Update return to give custom headline
            var todo_tasks = [];
            var in_progress_tasks = [];
            var done_tasks = [];

            for (var i = 0; i < this.props.tasks.length; i++) {
                if (this.props.tasks[i].flow_status === "To Do") {
                    todo_tasks.push(this.renderTask(this.props.tasks[i]));
                }
                if (this.props.tasks[i].flow_status === "In Progress") {
                    in_progress_tasks.push(this.renderTask(this.props.tasks[i]));
                }
                if (this.props.tasks[i].flow_status === "Done") {
                    done_tasks.push(this.renderTask(this.props.tasks[i]));
                }
            }

            return React.createElement(
                'div',
                { id: 'tasks-view' },
                React.createElement(
                    'h2',
                    null,
                    'Tasks'
                ),
                React.createElement(
                    'div',
                    { id: 'tasks-board' },
                    React.createElement(
                        'div',
                        { className: 'task-col', id: 'todo-col', onDrop: function onDrop(event) {
                                return _this14.drop(event, "To Do");
                            }, onDragOver: this.allowDrop },
                        React.createElement(
                            'h3',
                            null,
                            'To Do'
                        ),
                        todo_tasks
                    ),
                    React.createElement(
                        'div',
                        { className: 'task-col', id: 'progress-col', onDrop: function onDrop(event) {
                                return _this14.drop(event, "In Progress");
                            }, onDragOver: this.allowDrop },
                        React.createElement(
                            'h3',
                            null,
                            'In Progress'
                        ),
                        in_progress_tasks
                    ),
                    React.createElement(
                        'div',
                        { className: 'task-col', id: 'done-col', onDrop: function onDrop(event) {
                                return _this14.drop(event, "Done");
                            }, onDragOver: this.allowDrop },
                        React.createElement(
                            'h3',
                            null,
                            'Done'
                        ),
                        done_tasks
                    )
                ),
                React.createElement(
                    'button',
                    { type: 'button', className: 'btn btn-primary', onClick: this.props.exitTasks },
                    'Deadlines'
                )
            );
        }
    }]);

    return TasksBoard;
}(React.Component);

// =========================================================================

document.addEventListener('DOMContentLoaded', function () {

    ReactDOM.render(React.createElement(Project, null), document.getElementById("project-root"));
});