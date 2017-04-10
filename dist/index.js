'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _extends = _interopDefault(require('babel-runtime/helpers/extends'));
var _Object$getPrototypeOf = _interopDefault(require('babel-runtime/core-js/object/get-prototype-of'));
var _classCallCheck = _interopDefault(require('babel-runtime/helpers/classCallCheck'));
var _createClass = _interopDefault(require('babel-runtime/helpers/createClass'));
var _possibleConstructorReturn = _interopDefault(require('babel-runtime/helpers/possibleConstructorReturn'));
var _inherits = _interopDefault(require('babel-runtime/helpers/inherits'));
var _Object$keys = _interopDefault(require('babel-runtime/core-js/object/keys'));
var _JSON$stringify = _interopDefault(require('babel-runtime/core-js/json/stringify'));
var React = _interopDefault(require('react'));
var reselect = require('reselect');

/*
  Prototyping the custom selector to notify us about updates
*/

function defaultEqualityCheck(a, b) {
  return a === b;
}

function areArgumentsShallowlyEqual(equalityCheck, prev, next) {
  if (prev === null || next === null || prev.length !== next.length) {
    return false;
  }

  // Do this in a for loop (and not a `forEach` or an `every`) so we can determine equality as fast as possible.
  var length = prev.length;
  for (var i = 0; i < length; i++) {
    if (!equalityCheck(prev[i], next[i])) {
      return false;
    }
  }

  return true;
}

function defaultMemoize(func) {
  var equalityCheck = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultEqualityCheck;

  var lastArgs = null;
  var lastResult = null;
  // we reference arguments instead of spreading them for performance reasons
  return function () {
    var changed = false;

    if (!areArgumentsShallowlyEqual(equalityCheck, lastArgs, arguments)) {
      // apply arguments instead of spreading for performance.
      lastResult = func.apply(null, arguments);
      changed = true;
    }

    lastArgs = arguments;

    return {
      hasChanged: changed,
      data: lastResult
    };
  };
}

var getNotifyingSelectorCreator = function getNotifyingSelectorCreator() {
  return reselect.createSelectorCreator(defaultMemoize);
};

function slimReduxReact(params) {
  var WrappedComponent = params.component;
  var changeTriggers = params.changeTriggers || {};
  var subscriptions = params.subscriptions || {};

  var displayName = WrappedComponent.displayName || WrappedComponent.name || '';

  // Returns the appropriate part of the state for a string like "state.todo.active"
  var _getStateFromSubscriptionString = function _getStateFromSubscriptionString(subscriptionString, state) {
    var subStringParts = subscriptionString.split('.');
    var currentPath = 'state';
    var stateFromString = state;

    for (var i = 1; i < subStringParts.length; i++) {
      var nextPath = subStringParts[i];
      currentPath += '.' + nextPath;

      if (!(nextPath in stateFromString)) console.error('*** Error in slimReduxReact container ' + displayName + ':\nCannot find path "' + currentPath + ' in state.\nState: ' + _JSON$stringify(state, null, 2) + '"');

      stateFromString = stateFromString[nextPath];
    }

    return stateFromString;
  };

  // Retrieves the data for the subscriptions, first part of the subscription selector
  var getSubscriptions = function getSubscriptions(state) {
    var storeSubscriptions = {};
    _Object$keys(subscriptions).map(function (subscription) {
      return storeSubscriptions[subscription] = _getStateFromSubscriptionString(subscriptions[subscription], state);
    });
    return storeSubscriptions;
  };

  // Create subscrption selector
  var createNotifyingSelector = getNotifyingSelectorCreator();
  var checkSubscriptionSelector = createNotifyingSelector(getSubscriptions, function (subscriptionData) {
    return subscriptionData;
  });

  // Create change creators    TODO: change creators could also be functions to mock stuff!!


  var SlimReduxConnector = function (_React$Component) {
    _inherits(SlimReduxConnector, _React$Component);

    function SlimReduxConnector(props, context) {
      _classCallCheck(this, SlimReduxConnector);

      var _this = _possibleConstructorReturn(this, (SlimReduxConnector.__proto__ || _Object$getPrototypeOf(SlimReduxConnector)).call(this, props));

      if (!context.store) console.error('*** Error in SlimReduxConnector component: No store found in context. Did you forget to wrap your code in the <Provider> component?');

      var initialSubscriptionState = checkSubscriptionSelector(context.store.getState());
      _this.state = _extends({}, initialSubscriptionState.data);

      _this.registeredChangeTriggers = {};
      _Object$keys(changeTriggers).map(function (changeTrigger) {
        return _this.registeredChangeTriggers[changeTrigger] = context.store.createChangeTrigger(changeTriggers[changeTrigger]);
      });
      return _this;
    }

    _createClass(SlimReduxConnector, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        var _this2 = this;

        // SUBSCRIBE THIS MOTHERFUCKER TO SUBSCRIPTION CHANGES!
        this.context.store.subscribe(function () {
          var subscriptionState = checkSubscriptionSelector(_this2.context.store.getState());

          if (subscriptionState.hasChanged) _this2.setState(_extends({}, _this2.state, subscriptionState.data));
        });
      }
    }, {
      key: 'render',
      value: function render() {
        return React.createElement(WrappedComponent, _extends({}, this.props, this.registeredChangeTriggers, this.state));
      }
    }]);

    return SlimReduxConnector;
  }(React.Component);

  SlimReduxConnector.displayName = 'SlimReduxConnector' + displayName;

  SlimReduxConnector.contextTypes = {
    store: React.PropTypes.object
  };

  return SlimReduxConnector;
}

exports.slimReduxReact = slimReduxReact;
//# sourceMappingURL=index.js.map
