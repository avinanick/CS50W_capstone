'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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

var DeadlineLink = function (_React$Component2) {
    _inherits(DeadlineLink, _React$Component2);

    function DeadlineLink() {
        _classCallCheck(this, DeadlineLink);

        return _possibleConstructorReturn(this, (DeadlineLink.__proto__ || Object.getPrototypeOf(DeadlineLink)).apply(this, arguments));
    }

    _createClass(DeadlineLink, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                null,
                React.createElement('a', { href: '#' })
            );
        }
    }]);

    return DeadlineLink;
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
            return React.createElement(
                'div',
                { className: 'deadline-container', onClick: this.props.onClick(deadline_json.id) },
                'Deadline: ',
                deadline_json.date
            );
        }
    }, {
        key: 'render',
        value: function render() {

            var items = [];

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.props.deadlines[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _ref = _step.value;

                    var _ref2 = _slicedToArray(_ref, 2);

                    var index = _ref2[0];
                    var value = _ref2[1];

                    items.push(this.renderDeadline(value));
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return React.createElement(
                'div',
                null,
                items
            );
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
        var _this5 = _possibleConstructorReturn(this, (Project.__proto__ || Object.getPrototypeOf(Project)).call(this, props));

        _this5.state = {
            project_id: 0,
            section: {
                state: "deadlines",
                id: 0
            },
            project_deadlines: [],
            deadline_tasks: []
        };
        _this5.selectDeadline = _this5.selectDeadline.bind(_this5);
        _this5.selectTask = _this5.selectTask.bind(_this5);
        _this5.updateDeadlines = _this5.updateDeadlines.bind(_this5);
        var project_root = document.getElementById("project-root");
        _this5.state.project_id = project_root.dataset.projectid;
        _this5.updateDeadlines();
        return _this5;
    }

    _createClass(Project, [{
        key: 'hideDeadlineForm',
        value: function hideDeadlineForm() {
            document.querySelector("#deadline-form").style.display = "none";
        }
    }, {
        key: 'openDeadlineForm',
        value: function openDeadlineForm() {
            document.querySelector("#deadline-form").style.display = "block";
        }
    }, {
        key: 'selectDeadline',
        value: function selectDeadline(id) {
            // change the state to the deadline with id and change the visible
            // div to the tasks within that deadline
            this.state.section.state = "tasks";
            this.state.section.id = id;
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
            var _this6 = this;

            this.hideDeadlineForm();
            fetch('/get_deadlines/' + this.state.project_id).then(function (response) {
                return response.json();
            }).then(function (deadlines) {

                console.log(deadlines);
                _this6.state.project_deadlines = [];
                for (var i = 0; i < deadlines.deadlines.length; i++) {
                    _this6.state.project_deadlines.concat([{
                        date: deadlines.deadlines[i].date,
                        id: deadlines.deadlines[i].id
                    }]);
                }
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this7 = this;

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
                            return _this7.selectDeadline(i);
                        }
                    }),
                    React.createElement(CreateDeadlineForm, {
                        project_id: this.state.project_id,
                        onSubmit: this.updateDeadlines,
                        cancel_response: this.hideDeadlineForm
                    }),
                    React.createElement(ProjectTaskbar, {
                        deadline_click: this.openDeadlineForm
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
                    { className: 'btn btn-light' },
                    'Create Task'
                )
            );
        }
    }]);

    return ProjectTaskbar;
}(React.Component);

function GetTasks(deadline_id) {}

// =========================================================================

document.addEventListener('DOMContentLoaded', function () {

    ReactDOM.render(React.createElement(Project, null), document.getElementById("project-root"));
});