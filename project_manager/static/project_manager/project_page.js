'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DeadlineLink = function (_React$Component) {
    _inherits(DeadlineLink, _React$Component);

    function DeadlineLink() {
        _classCallCheck(this, DeadlineLink);

        return _possibleConstructorReturn(this, (DeadlineLink.__proto__ || Object.getPrototypeOf(DeadlineLink)).apply(this, arguments));
    }

    _createClass(DeadlineLink, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                null,
                React.createElement("a", { href: "#" })
            );
        }
    }]);

    return DeadlineLink;
}(React.Component);

var DeadlineList = function (_React$Component2) {
    _inherits(DeadlineList, _React$Component2);

    function DeadlineList() {
        _classCallCheck(this, DeadlineList);

        return _possibleConstructorReturn(this, (DeadlineList.__proto__ || Object.getPrototypeOf(DeadlineList)).apply(this, arguments));
    }

    _createClass(DeadlineList, [{
        key: "renderDeadline",
        value: function renderDeadline(deadline_json) {
            return React.createElement(
                "div",
                { className: "deadline-container", onClick: this.props.onClick(deadline_json.id) },
                "Deadline: ",
                deadline_json.date
            );
        }
    }, {
        key: "render",
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
                "div",
                null,
                items
            );
        }
    }]);

    return DeadlineList;
}(React.Component);

var Project = function (_React$Component3) {
    _inherits(Project, _React$Component3);

    function Project(props) {
        _classCallCheck(this, Project);

        // I need to check the div for which project I'm loading so I can fetch the
        // correct deadlines
        var _this3 = _possibleConstructorReturn(this, (Project.__proto__ || Object.getPrototypeOf(Project)).call(this, props));

        _this3.state = {
            project_id: 0,
            section: {
                state: "deadlines",
                id: 0
            },
            project_deadlines: [],
            deadline_tasks: []
        };
        var project_root = document.getElementById("project-root");
        _this3.state.project_id = project_root.dataset.projectid;
        _this3.updateDeadlines();
        return _this3;
    }

    _createClass(Project, [{
        key: "selectDeadline",
        value: function selectDeadline(id) {
            // change the state to the deadline with id and change the visible
            // div to the tasks within that deadline
            this.state.section.state = "tasks";
            this.state.section.id = id;
        }
    }, {
        key: "selectTask",
        value: function selectTask(id) {
            // change the state to the task with id and change the visible 
            // div to the id with information
        }
    }, {
        key: "updateDeadlines",
        value: function updateDeadlines() {
            var _this4 = this;

            fetch('/get_deadlines/' + this.state.project_id).then(function (response) {
                return response.json();
            }).then(function (deadlines) {

                console.log(deadlines);
                _this4.state.project_deadlines = [];
                for (var i = 0; i < deadlines.deadlines.length; i++) {
                    _this4.state.project_deadlines.concat([{
                        date: deadlines.deadlines[i].date,
                        id: deadlines.deadlines[i].id
                    }]);
                }
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this5 = this;

            // This should check what state the page is in, and render
            // as appropriate
            if (this.state.section.state === "deadlines") {
                return React.createElement(DeadlineList, {
                    deadlines: this.state.project_deadlines,
                    onClick: function onClick(i) {
                        return _this5.selectDeadline(i);
                    }
                });
            }
        }
    }]);

    return Project;
}(React.Component);

function GetTasks(deadline_id) {}

// =========================================================================

document.addEventListener('DOMContentLoaded', function () {

    ReactDOM.render(React.createElement(Project, null), document.getElementById("project-root"));
});