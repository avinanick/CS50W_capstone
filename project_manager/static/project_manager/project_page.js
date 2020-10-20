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
        key: "render",
        value: function render() {}
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
            section: "deadlines"
        };
        return _this3;
    }

    _createClass(Project, [{
        key: "selectDeadline",
        value: function selectDeadline(id) {
            // change the state to the deadline with id and change the visible
            // div to the tasks within that deadline
        }
    }, {
        key: "selectTask",
        value: function selectTask(id) {
            // change the state to the task with id and change the visible 
            // div to the id with information
        }
    }]);

    return Project;
}(React.Component);

function GetTasks(deadline_id) {}