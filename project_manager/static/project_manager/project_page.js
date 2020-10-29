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

            console.log(deadline_json.id);
            var deadline_id_name = "deadline-" + deadline_json.id;
            return React.createElement(
                'div',
                { id: deadline_id_name, className: 'deadline-container', onClick: function onClick() {
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
                            return _this7.props.onClick(0);
                        }, key: '-1' },
                    'Unsorted'
                )
            );
        }
    }]);

    return DeadlineList;
}(React.Component);

var EditTaskForm = function (_React$Component4) {
    _inherits(EditTaskForm, _React$Component4);

    function EditTaskForm(props) {
        _classCallCheck(this, EditTaskForm);

        var _this8 = _possibleConstructorReturn(this, (EditTaskForm.__proto__ || Object.getPrototypeOf(EditTaskForm)).call(this, props));

        _this8.state = {
            linked_project: parseInt(_this8.props.project_id),
            title: _this8.props.task.title,
            description: _this8.props.task.description,
            linked_deadline: _this8.props.task.deadline_id
        };

        _this8.deadlineChanged = _this8.deadlineChanged.bind(_this8);
        _this8.descriptionChanged = _this8.descriptionChanged.bind(_this8);
        _this8.titleChanged = _this8.titleChanged.bind(_this8);
        _this8.submit_response = _this8.submit_response.bind(_this8);
        return _this8;
    }

    _createClass(EditTaskForm, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            this.setState({ title: nextProps.task.title });
            this.setState({ description: nextProps.task.description });
            this.setState({ linked_deadline: nextProps.task.deadline_id });
        }
    }, {
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
            var _this9 = this;

            event.preventDefault();

            var csrftoken = getCookie('csrftoken');

            fetch('/update_task', {
                headers: { 'X-CSRFToken': csrftoken },
                method: 'POST',
                body: JSON.stringify({
                    //content: post_content
                    task_id: parseInt(this.props.task.id),

                    title: this.state.title,
                    description: this.state.description,
                    deadline_id: parseInt(this.state.linked_deadline)
                })
            }).then(function (response) {
                console.log(response);
                _this9.props.onSubmit();
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

            return React.createElement(
                'div',
                { className: 'overlay-form', id: 'update-task-form' },
                React.createElement(
                    'form',
                    { onSubmit: this.submit_response },
                    React.createElement(
                        'h3',
                        null,
                        'Edit Task'
                    ),
                    React.createElement('input', { type: 'text', name: 'task-title', id: 'task-title', placeholder: 'Task Title', maxLength: '1024', onChange: this.titleChanged, value: this.state.title }),
                    React.createElement('input', { type: 'text', name: 'task-description', id: 'task-description', placeholder: 'Task Description', onChange: this.descriptionChanged, value: this.state.description }),
                    React.createElement(
                        'select',
                        { name: 'deadlines', id: 'deadlines', onChange: this.deadlineChanged, value: this.state.linked_deadline },
                        deadline_options,
                        React.createElement(
                            'option',
                            { value: '0' },
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

    return EditTaskForm;
}(React.Component);

var Project = function (_React$Component5) {
    _inherits(Project, _React$Component5);

    function Project(props) {
        _classCallCheck(this, Project);

        // I need to check the div for which project I'm loading so I can fetch the
        // correct deadlines
        var _this10 = _possibleConstructorReturn(this, (Project.__proto__ || Object.getPrototypeOf(Project)).call(this, props));

        _this10.state = {
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
        _this10.selectDeadline = _this10.selectDeadline.bind(_this10);
        _this10.selectTask = _this10.selectTask.bind(_this10);
        _this10.updateDeadlines = _this10.updateDeadlines.bind(_this10);
        _this10.updateTasks = _this10.updateTasks.bind(_this10);
        _this10.exitTasksView = _this10.exitTasksView.bind(_this10);
        var project_root = document.getElementById("project-root");
        _this10.state.project_id = project_root.dataset.projectid;
        _this10.updateDeadlines();
        _this10.getAuthority();
        return _this10;
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
        key: 'getAuthority',
        value: function getAuthority() {
            var _this11 = this;

            fetch("/authority/" + this.state.project_id).then(function (response) {
                return response.json();
            }).then(function (auth) {
                console.log(auth);
                _this11.setState({ authority_level: auth.auth_level });
            });
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
        key: 'hideEditForm',
        value: function hideEditForm() {
            var hide_form = document.querySelector("#update-task-form");
            if (hide_form) {
                hide_form.style.display = "none";
            }
        }
    }, {
        key: 'hideMembershipForm',
        value: function hideMembershipForm() {
            var hide_form = document.querySelector("#memberships-form");
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
        key: 'openMembershipForm',
        value: function openMembershipForm() {
            document.querySelector("#memberships-form").style.display = "block";
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
        value: function selectTask(task_json) {
            // change the state to the task with id and change the visible 
            // div to the id with information
            this.setState({ selected_task: task_json });
            console.log("Selecting task linked to " + task_json.deadline_id);
            document.querySelector("#update-task-form").style.display = "block";
        }
    }, {
        key: 'updateDeadlines',
        value: function updateDeadlines() {
            var _this12 = this;

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

                _this12.setState({ project_deadlines: deadlines_list });
            });
        }
    }, {
        key: 'updateTasks',
        value: function updateTasks(deadline_id) {
            var _this13 = this;

            // if the current state section id is greater than 0, get the 
            // tasks that go with that deadline id, otherwise do nothing
            fetch('/get_tasks/' + this.state.project_id + '/' + deadline_id).then(function (response) {
                return response.json();
            }).then(function (tasks) {

                var tasks_list = [];

                for (var i = 0; i < tasks.tasks.length; i++) {

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

                _this13.setState({ deadline_tasks: tasks_list });
            });
        }
    }, {
        key: 'render',
        value: function render() {
            // This should check what state the page is in, and render
            // as appropriate
            // I need to make the bottom bar section next, and likely move
            // the if statement before the return
            if (this.state.authority_level === "none") {
                return React.createElement(
                    'div',
                    null,
                    'Error: User not authorized for project.'
                );
            }

            var main_body = [];
            if (this.state.section.state === "deadlines") {
                main_body.push(React.createElement(DeadlineList, {
                    deadlines: this.state.project_deadlines,
                    onClick: this.selectDeadline
                }));
            } else {
                main_body.push(React.createElement(TasksBoard, {
                    tasks: this.state.deadline_tasks,
                    exitTasks: this.exitTasksView,
                    task_click: this.selectTask
                }));
            }

            // Need to double check if this is the actual authority level name
            if (this.state.authority_level != "Member") {
                main_body.push(React.createElement(ManageUsers, {
                    authority_level: this.state.authority_level,
                    close_form: this.hideMembershipForm,
                    project_id: this.state.project_id
                }));
            }

            return React.createElement(
                'div',
                null,
                main_body,
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
                React.createElement(EditTaskForm, {
                    project_id: this.state.project_id,
                    project_deadlines: this.state.project_deadlines,
                    task: this.state.selected_task,
                    onSubmit: this.hideEditForm,
                    cancel_response: this.hideEditForm
                }),
                React.createElement(ProjectTaskbar, {
                    deadline_click: this.openDeadlineForm,
                    task_click: this.openTaskForm,
                    authority_level: this.state.authority_level,
                    member_click: this.openMembershipForm
                })
            );
        }
    }]);

    return Project;
}(React.Component);

var ProjectTaskbar = function (_React$Component6) {
    _inherits(ProjectTaskbar, _React$Component6);

    function ProjectTaskbar() {
        _classCallCheck(this, ProjectTaskbar);

        return _possibleConstructorReturn(this, (ProjectTaskbar.__proto__ || Object.getPrototypeOf(ProjectTaskbar)).apply(this, arguments));
    }

    _createClass(ProjectTaskbar, [{
        key: 'render',
        value: function render() {
            var member_button = [];
            if (this.props.authority_level != "Member") {
                member_button.push(React.createElement(
                    'button',
                    {
                        className: 'btn btn-light',
                        onClick: this.props.member_click },
                    'Edit Members'
                ));
            }
            return React.createElement(
                'div',
                { className: 'bottom-taskbar' },
                React.createElement(
                    'button',
                    { className: 'btn btn-light', onClick: this.props.deadline_click },
                    'Create Deadline'
                ),
                member_button,
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

var ManageUsers = function (_React$Component7) {
    _inherits(ManageUsers, _React$Component7);

    function ManageUsers(props) {
        _classCallCheck(this, ManageUsers);

        var _this15 = _possibleConstructorReturn(this, (ManageUsers.__proto__ || Object.getPrototypeOf(ManageUsers)).call(this, props));

        _this15.state = {
            managers: [],
            members: []
        };

        _this15.updateUsers();
        return _this15;
    }

    _createClass(ManageUsers, [{
        key: 'updateUsers',
        value: function updateUsers() {
            var _this16 = this;

            fetch("/members/" + this.props.project_id).then(function (response) {
                return response.json();
            }).then(function (members) {
                console.log(members);

                var update_managers = [];
                var update_members = [];

                for (var i = 0; i < members.members.length; i++) {
                    if (members.members[i].authority === "Manager") {
                        update_managers.push(members.members[i].name);
                    }
                    if (members.members[i].authority === "Member") {
                        update_members.push(members.members[i].name);
                    }
                }

                _this16.setState({ managers: update_managers });
                _this16.setState({ members: update_members });
            });
        }
    }, {
        key: 'renderManagersSelect',
        value: function renderManagersSelect() {
            // If the user isn't the owner, they shouldn't be able
            // to modify any managers
            if (this.props.authority_level != "Owner") {
                return React.createElement('div', null);
            }
            var managerslist = [];

            for (var i = 0; i < this.state.managers; i++) {
                managerslist.push(this.renderOption(this.state.managers[i]));
            }

            return React.createElement(
                'div',
                null,
                React.createElement(
                    'label',
                    { 'for': 'members-select' },
                    'Members'
                ),
                React.createElement(
                    'select',
                    { name: 'members', id: 'members-select', multiple: true },
                    managerslist
                ),
                React.createElement(
                    'button',
                    { type: 'button' },
                    'Demote'
                ),
                React.createElement(
                    'button',
                    { type: 'button' },
                    'Remove'
                )
            );
        }
    }, {
        key: 'renderMembersSelect',
        value: function renderMembersSelect() {
            var memberslist = [];

            for (var i = 0; i < this.state.members; i++) {
                memberslist.push(this.renderOption(this.state.members[i]));
            }

            var promote_button = [];
            if (this.props.authority_level === "Owner") {
                promote_button.push(React.createElement(
                    'button',
                    { type: 'button' },
                    'Promote'
                ));
            }

            return React.createElement(
                'div',
                null,
                React.createElement(
                    'label',
                    { 'for': 'members-select' },
                    'Members'
                ),
                React.createElement(
                    'select',
                    { name: 'members', id: 'members-select', multiple: true },
                    memberslist
                ),
                promote_button,
                React.createElement(
                    'button',
                    { type: 'button' },
                    'Remove'
                )
            );
        }
    }, {
        key: 'renderOption',
        value: function renderOption(username) {
            return React.createElement(
                'option',
                { value: username },
                username
            );
        }
    }, {
        key: 'render',
        value: function render() {

            var aut_level_items = [];

            if (this.props.authority_level === "Owner") {}

            return React.createElement(
                'div',
                { className: 'overlay-form', id: 'memberships-form' },
                React.createElement(
                    'form',
                    null,
                    React.createElement(
                        'h3',
                        null,
                        'Manage Users'
                    ),
                    React.createElement(
                        'div',
                        { className: '' },
                        React.createElement(
                            'label',
                            { 'for': 'member-invite', className: '' },
                            'Invite Member'
                        ),
                        React.createElement('input', { id: 'member-invite', className: '', type: 'text', placeholder: 'Member name' }),
                        React.createElement(
                            'button',
                            { type: 'button', className: 'btn btn-primary' },
                            'Invite'
                        )
                    ),
                    React.createElement(
                        'button',
                        { type: 'button', className: 'btn btn-primary', onClick: this.props.close_form },
                        'Close'
                    )
                )
            );
        }
    }]);

    return ManageUsers;
}(React.Component);

var TasksBoard = function (_React$Component8) {
    _inherits(TasksBoard, _React$Component8);

    function TasksBoard(props) {
        _classCallCheck(this, TasksBoard);

        var _this17 = _possibleConstructorReturn(this, (TasksBoard.__proto__ || Object.getPrototypeOf(TasksBoard)).call(this, props));

        _this17.state = {
            dragged_task: -1
        };
        return _this17;
    }

    _createClass(TasksBoard, [{
        key: 'allowDrop',
        value: function allowDrop(event) {
            event.preventDefault();
        }
    }, {
        key: 'drag',
        value: function drag(event, task_id) {
            event.dataTransfer.setData("text", event.target.id);
            this.state.dragged_task = task_id;
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
            console.log(this.state.dragged_task);

            var csrftoken = getCookie('csrftoken');

            fetch('/update_task', {
                headers: { 'X-CSRFToken': csrftoken },
                method: 'PUT',
                body: JSON.stringify({
                    //content: post_content
                    task_id: parseInt(this.state.dragged_task),
                    workflow: new_flow
                })
            }).then(function (response) {
                console.log(response);
            });
        }
    }, {
        key: 'renderTask',
        value: function renderTask(task_json) {
            var _this18 = this;

            var task_id = "task" + task_json.id;
            return React.createElement(
                'div',
                { id: task_id, onClick: function onClick() {
                        return _this18.props.task_click(task_json);
                    }, className: 'task-display', draggable: 'true', key: task_json.id, onDragStart: function onDragStart(event) {
                        return _this18.drag(event, task_json.id);
                    } },
                task_json.title
            );
        }
    }, {
        key: 'render',
        value: function render() {
            var _this19 = this;

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
                                return _this19.drop(event, "To Do");
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
                                return _this19.drop(event, "In Progress");
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
                                return _this19.drop(event, "Done");
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