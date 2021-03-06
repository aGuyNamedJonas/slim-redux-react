(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('babel-runtime/helpers/extends'), require('babel-runtime/core-js/object/get-prototype-of'), require('babel-runtime/helpers/classCallCheck'), require('babel-runtime/helpers/createClass'), require('babel-runtime/helpers/possibleConstructorReturn'), require('babel-runtime/helpers/inherits'), require('babel-runtime/core-js/object/keys'), require('babel-runtime/core-js/json/stringify'), require('react'), require('reselect'), require('react-redux')) :
  typeof define === 'function' && define.amd ? define(['exports', 'babel-runtime/helpers/extends', 'babel-runtime/core-js/object/get-prototype-of', 'babel-runtime/helpers/classCallCheck', 'babel-runtime/helpers/createClass', 'babel-runtime/helpers/possibleConstructorReturn', 'babel-runtime/helpers/inherits', 'babel-runtime/core-js/object/keys', 'babel-runtime/core-js/json/stringify', 'react', 'reselect', 'react-redux'], factory) :
  (factory((global.slim-redux-react = global.slim-redux-react || {}),global._extends,global._Object$getPrototypeOf,global._classCallCheck,global._createClass,global._possibleConstructorReturn,global._inherits,global._Object$keys,global._JSON$stringify,global.React,global.reselect,global.reactRedux));
}(this, (function (exports,_extends,_Object$getPrototypeOf,_classCallCheck,_createClass,_possibleConstructorReturn,_inherits,_Object$keys,_JSON$stringify,React,reselect,reactRedux) { 'use strict';

_extends = 'default' in _extends ? _extends['default'] : _extends;
_Object$getPrototypeOf = 'default' in _Object$getPrototypeOf ? _Object$getPrototypeOf['default'] : _Object$getPrototypeOf;
_classCallCheck = 'default' in _classCallCheck ? _classCallCheck['default'] : _classCallCheck;
_createClass = 'default' in _createClass ? _createClass['default'] : _createClass;
_possibleConstructorReturn = 'default' in _possibleConstructorReturn ? _possibleConstructorReturn['default'] : _possibleConstructorReturn;
_inherits = 'default' in _inherits ? _inherits['default'] : _inherits;
_Object$keys = 'default' in _Object$keys ? _Object$keys['default'] : _Object$keys;
_JSON$stringify = 'default' in _JSON$stringify ? _JSON$stringify['default'] : _JSON$stringify;
React = 'default' in React ? React['default'] : React;

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
exports.Provider = reactRedux.Provider;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.umd.js.map
