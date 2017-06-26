import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import _Object$keys from 'babel-runtime/core-js/object/keys';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import { Provider } from 'react-redux';
import { calculation, changeTrigger, subscription } from 'slim-redux';

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
        return subscription(subscription$$1, changeCallback, storeArg);
    };
    return createSubscription;
}

function calculation$1(subscriptions, calcFunction) {
    var createCalculation = function createCalculation(changeCallback, storeArg) {
        return calculation(subscriptions, calcFunction, changeCallback, storeArg);
    };
    return createCalculation;
}

function changeTrigger$1(actionType, reducer, focusSubString) {
    var createChangeTrigger = function createChangeTrigger(actionType, reducer, focusSubString) {
        return changeTrigger(actionType, reducer, focusSubString);
    };
    return createChangeTrigger;
}

function asyncChangeTrigger(actionType, reducer, focusSubString) {
    var createAsyncChangeTrigger = function createAsyncChangeTrigger(actionType, reducer, focusSubString) {
        return slimReduxChangeTrigger(actionType, reducer, focusSubString);
    };
    return createAsyncChangeTrigger;
}

export { connect, Provider, subscription$1 as subscription, calculation$1 as calculation, changeTrigger$1 as changeTrigger, asyncChangeTrigger };
//# sourceMappingURL=index.es.js.map
