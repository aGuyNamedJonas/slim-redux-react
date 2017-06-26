(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('babel-runtime/helpers/defineProperty'), require('babel-runtime/helpers/extends'), require('babel-runtime/core-js/object/keys'), require('babel-runtime/core-js/object/get-prototype-of'), require('babel-runtime/helpers/classCallCheck'), require('babel-runtime/helpers/createClass'), require('babel-runtime/helpers/possibleConstructorReturn'), require('babel-runtime/helpers/inherits'), require('react'), require('react-redux'), require('slim-redux')) :
  typeof define === 'function' && define.amd ? define(['exports', 'babel-runtime/helpers/defineProperty', 'babel-runtime/helpers/extends', 'babel-runtime/core-js/object/keys', 'babel-runtime/core-js/object/get-prototype-of', 'babel-runtime/helpers/classCallCheck', 'babel-runtime/helpers/createClass', 'babel-runtime/helpers/possibleConstructorReturn', 'babel-runtime/helpers/inherits', 'react', 'react-redux', 'slim-redux'], factory) :
  (factory((global.slim-redux-react = global.slim-redux-react || {}),global._defineProperty,global._extends,global._Object$keys,global._Object$getPrototypeOf,global._classCallCheck,global._createClass,global._possibleConstructorReturn,global._inherits,global.React,global.reactRedux,global.slimRedux));
}(this, (function (exports,_defineProperty,_extends,_Object$keys,_Object$getPrototypeOf,_classCallCheck,_createClass,_possibleConstructorReturn,_inherits,React,reactRedux,slimRedux) { 'use strict';

_defineProperty = 'default' in _defineProperty ? _defineProperty['default'] : _defineProperty;
_extends = 'default' in _extends ? _extends['default'] : _extends;
_Object$keys = 'default' in _Object$keys ? _Object$keys['default'] : _Object$keys;
_Object$getPrototypeOf = 'default' in _Object$getPrototypeOf ? _Object$getPrototypeOf['default'] : _Object$getPrototypeOf;
_classCallCheck = 'default' in _classCallCheck ? _classCallCheck['default'] : _classCallCheck;
_createClass = 'default' in _createClass ? _createClass['default'] : _createClass;
_possibleConstructorReturn = 'default' in _possibleConstructorReturn ? _possibleConstructorReturn['default'] : _possibleConstructorReturn;
_inherits = 'default' in _inherits ? _inherits['default'] : _inherits;
React = 'default' in React ? React['default'] : React;

var error = function error(location, msg) {
  throw new Error("*** Error in " + location + ": " + msg);
};

function connect(component, subsAndCalcs, changeTriggers) {
    var displayName = component.displayName || component.name || 'SlimReduxReact',
        error$$1 = function error$$1(msg) {
        return error('<' + displayName + '/>', msg);
    };

    var SlimReduxConnector = function (_React$Component) {
        _inherits(SlimReduxConnector, _React$Component);

        function SlimReduxConnector(props, context) {
            _classCallCheck(this, SlimReduxConnector);

            // Check for store instance
            var _this = _possibleConstructorReturn(this, (SlimReduxConnector.__proto__ || _Object$getPrototypeOf(SlimReduxConnector)).call(this, props));

            if (!context.store) error$$1('No store found in context. Did you forget to wrap your code in the <Provider> component?');

            var store = context.store;

            // Setup initial state
            var initialState = {};

            // Go through subscriptions and calculations and set them up to feed into the state
            _Object$keys(subsAndCalcs).map(function (key) {
                var stateKey = key;

                // Create a closure so that the stateKey is still available after this setup code has executed
                (function () {
                    var _this2 = this;

                    // Hook it up to the state
                    var getInitialValue = subsAndCalcs[key](function (value) {
                        _this2.setState(_extends({}, _this2.state, _defineProperty({}, stateKey, value)));
                    }, store);

                    // Get initial state
                    initialState[key] = getInitialValue();
                })();
            });

            _this.wrappedChangeTriggers = {};

            // Go through change triggers and wrap them to use the current store instance
            _Object$keys(changeTriggers).map(function (key) {
                wrappedChangeTriggers[key] = function () {
                    // Creating a new closure to preserve the store instance
                    var ct = changeTriggers[key];

                    // We only pass down the parameters to the change trigger if the change trigger accepts any

                    for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
                        params[_key] = arguments[_key];
                    }

                    if (ct.length === 1) ct(store);else ct.apply(undefined, params.concat([store]));
                };
            });
            return _this;
        }

        _createClass(SlimReduxConnector, [{
            key: 'componentDidMount',
            value: function componentDidMount() {}
        }, {
            key: 'render',
            value: function render() {
                return React.createElement(WrappedComponent, _extends({}, this.props, this.wrappedChangeTriggers, this.state));
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

function subscription$1(subscription$$1) {
    var createSubscription = function createSubscription(changeCallback, storeArg) {
        return slimRedux.subscription(subscription$$1, changeCallback, storeArg);
    };
    return createSubscription;
}

function calculation$1(subscriptions, calcFunction) {
    var createCalculation = function createCalculation(changeCallback, storeArg) {
        return slimRedux.calculation(subscriptions, calcFunction, changeCallback, storeArg);
    };
    return createCalculation;
}

function changeTrigger$1(actionType, reducer, focusSubString) {
    var createChangeTrigger = function createChangeTrigger(actionType, reducer, focusSubString) {
        return slimRedux.changeTrigger(actionType, reducer, focusSubString);
    };
    return createChangeTrigger;
}

function asyncChangeTrigger(actionType, reducer, focusSubString) {
    var createAsyncChangeTrigger = function createAsyncChangeTrigger(actionType, reducer, focusSubString) {
        return slimReduxChangeTrigger(actionType, reducer, focusSubString);
    };
    return createAsyncChangeTrigger;
}

exports.connect = connect;
exports.Provider = reactRedux.Provider;
exports.subscription = subscription$1;
exports.calculation = calculation$1;
exports.changeTrigger = changeTrigger$1;
exports.asyncChangeTrigger = asyncChangeTrigger;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.umd.js.map
