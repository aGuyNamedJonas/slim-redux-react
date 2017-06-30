(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('babel-runtime/helpers/extends'), require('babel-runtime/helpers/defineProperty'), require('babel-runtime/core-js/object/keys'), require('babel-runtime/core-js/json/stringify'), require('babel-runtime/core-js/object/get-prototype-of'), require('babel-runtime/helpers/classCallCheck'), require('babel-runtime/helpers/createClass'), require('babel-runtime/helpers/possibleConstructorReturn'), require('babel-runtime/helpers/inherits'), require('react'), require('react-redux'), require('slim-redux')) :
  typeof define === 'function' && define.amd ? define(['exports', 'babel-runtime/helpers/extends', 'babel-runtime/helpers/defineProperty', 'babel-runtime/core-js/object/keys', 'babel-runtime/core-js/json/stringify', 'babel-runtime/core-js/object/get-prototype-of', 'babel-runtime/helpers/classCallCheck', 'babel-runtime/helpers/createClass', 'babel-runtime/helpers/possibleConstructorReturn', 'babel-runtime/helpers/inherits', 'react', 'react-redux', 'slim-redux'], factory) :
  (factory((global.slim-redux-react = global.slim-redux-react || {}),global._extends,global._defineProperty,global._Object$keys,global._JSON$stringify,global._Object$getPrototypeOf,global._classCallCheck,global._createClass,global._possibleConstructorReturn,global._inherits,global.React,global.reactRedux,global.slimRedux));
}(this, (function (exports,_extends,_defineProperty,_Object$keys,_JSON$stringify,_Object$getPrototypeOf,_classCallCheck,_createClass,_possibleConstructorReturn,_inherits,React,reactRedux,slimRedux) { 'use strict';

_extends = 'default' in _extends ? _extends['default'] : _extends;
_defineProperty = 'default' in _defineProperty ? _defineProperty['default'] : _defineProperty;
_Object$keys = 'default' in _Object$keys ? _Object$keys['default'] : _Object$keys;
_JSON$stringify = 'default' in _JSON$stringify ? _JSON$stringify['default'] : _JSON$stringify;
_Object$getPrototypeOf = 'default' in _Object$getPrototypeOf ? _Object$getPrototypeOf['default'] : _Object$getPrototypeOf;
_classCallCheck = 'default' in _classCallCheck ? _classCallCheck['default'] : _classCallCheck;
_createClass = 'default' in _createClass ? _createClass['default'] : _createClass;
_possibleConstructorReturn = 'default' in _possibleConstructorReturn ? _possibleConstructorReturn['default'] : _possibleConstructorReturn;
_inherits = 'default' in _inherits ? _inherits['default'] : _inherits;
React = 'default' in React ? React['default'] : React;

var error = function error(location, msg) {
  throw new Error('*** Error in ' + location + ': ' + msg);
};

/*
  Functions to determine the type of something
  Pattern stolen from here: http://tobyho.com/2011/01/28/checking-types-in-javascript/
*/
var getType = function getType(whatever) {
  return whatever.constructor;
};
var isObject = function isObject(obj) {
  return obj.constructor === Object;
};


var isFunction = function isFunction(func) {
  return typeof func == 'function';
}; // Taken from: https://jsperf.com/alternative-isfunction-implementations/4

var isSet = function isSet(smthg) {
  return smthg !== undefined && smthg !== null;
};
 // Taken from: https://stackoverflow.com/questions/3000649/trim-spaces-from-start-and-end-of-string



/*
  Validates a subscription string
*/

var SUBSCRIPTION = 'SUBSCRIPTION';
var CALCULATION = 'CALCULATION';
var CHANGE_TRIGGER = 'CHANGE_TRIGGER';
var ASYNC_CHANGE_TRIGGER = 'ASYNC_CHANGE_TRIGGER';
var SLIM_REDUX_COMP_NOTICE = 'Remember: For slim-redux-react you need to use the provided API functions to create subscriptions, calculations, and (async) change triggers. They re-use the slim-redux API, so it\'s possible to re-use slim-redux code. To find out more on how to achieve that, please visit: https://github.com/aGuyNamedJonas/slim-redux-react/blob/0.2-release/README.md#reusing-slim-redux-code-in-slim-redux-react';

function connect(component, stuff) {
    var WrappedComponent = component,
        displayName = component.displayName || component.name || 'SlimReduxReact',
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

            // Setup empty change trigger object
            _this.wrappedChangeTriggers = {};

            // Make sure the stuff object is an object
            if (!isObject(stuff)) error$$1('"stuff" (second parameter) is expected to be of type "object", got ' + getType(stuff) + ' instead: \n ' + _JSON$stringify(stuff, null, 2));

            // Go through the stuff object
            _Object$keys(stuff).map(function (key) {
                // Make sure that the API functions have been used!
                if (!stuff[key].type || !(stuff[key].type === SUBSCRIPTION || stuff[key].type === CALCULATION || stuff[key].type === CHANGE_TRIGGER || stuff[key].type === ASYNC_CHANGE_TRIGGER)) error$$1('No "type" field found in stuff-object element "' + key + '". Make sure to use the slim-redux-react API functions to create subscriptions, calculations, and (async) change triggers! \n ' + _JSON$stringify(stuff, null, 2));

                // Setup subscription / calculation
                if (stuff[key].type === SUBSCRIPTION || stuff[key].type === CALCULATION) {
                    var stateKey = key;

                    // Create a closure so that the stateKey is still available after this setup code has executed
                    (function () {
                        var _this2 = this;

                        // Hook it up to the state
                        var getInitialValue = stuff[key].creatorFunction(function (value) {
                            console.log('*** Changecallback for ' + stateKey + ', new value: ' + value);
                            _this2.setState(_defineProperty({}, stateKey, value));
                        }, store);

                        // Get initial state
                        initialState[key] = getInitialValue();
                    }).apply(_this, []);
                }

                // Setup change trigger / async change trigger
                if (stuff[key].type === CHANGE_TRIGGER || stuff[key].type === ASYNC_CHANGE_TRIGGER) {
                    var ctKey = key,
                        ctStore = store,
                        ct = stuff[ctKey].creatorFunction();

                    _this.wrappedChangeTriggers[key] = function () {
                        // We only pass down the parameters to the change trigger if the change trigger accepts any
                        if (ct.length === 1) return function () {
                            ct(ctStore);
                        };else return function () {
                            for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
                                params[_key] = arguments[_key];
                            }

                            ct.apply(undefined, params.concat([ctStore]));
                        };
                    }();
                }
            });

            // Set initial state
            _this.state = initialState;

            // // Go through subscriptions and calculations and set them up to feed into the state
            // Object.keys(subsAndCalcs).map(key => {
            //     const stateKey = key;

            //     // Create a closure so that the stateKey is still available after this setup code has executed
            //     (function(){
            //         // Hook it up to the state
            //         const getInitialValue = subsAndCalcs[key](value => {
            //             this.setState({...this.state, [stateKey]: value});
            //         }, store);

            //         // Get initial state
            //         initialState[key] = getInitialValue();
            //     })()
            // });

            // this.wrappedChangeTriggers = {};

            // // Go through change triggers and wrap them to use the current store instance
            // Object.keys(changeTriggers).map(key => {
            //     wrappedChangeTriggers[key] = function(...params){
            //         // Creating a new closure to preserve the store instance
            //         const ct = changeTriggers[key];

            //         // We only pass down the parameters to the change trigger if the change trigger accepts any
            //         if(ct.length === 1)
            //             ct(store);
            //         else
            //             ct(...params, store);
            //         }
            // });
            return _this;
        }

        _createClass(SlimReduxConnector, [{
            key: 'componentDidMount',
            value: function componentDidMount() {}
        }, {
            key: 'render',
            value: function render() {
                return React.createElement(WrappedComponent, _extends({}, this.props, this.initialState, this.wrappedChangeTriggers, this.state));
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
    return {
        type: SUBSCRIPTION,
        creatorFunction: createSubscription
    };
}

function calculation$1(subscriptions, calcFunction) {
    var createCalculation = function createCalculation(changeCallback, storeArg) {
        return slimRedux.calculation(subscriptions, calcFunction, changeCallback, storeArg);
    };
    return {
        type: CALCULATION,
        creatorFunction: createCalculation
    };
}

function changeTrigger$1(actionType, reducer, focusSubString) {
    var createChangeTrigger = function createChangeTrigger() {
        return slimRedux.changeTrigger(actionType, reducer, focusSubString);
    };
    return {
        type: CHANGE_TRIGGER,
        creatorFunction: createChangeTrigger
    };
}

var error$1 = function error$1(msg) {
    return error('slim-redux-react asyncChangeTrigger()', msg);
};

function asyncChangeTrigger$1(changeTriggers, triggerFunction) {
    var _arguments = arguments;

    // Parameter validation
    if (!isSet(changeTriggers)) error$1('"changeTrigger" (first argument) cannot be null or undefined: \n ' + _JSON$stringify(arguments, null, 2));

    if (!isObject(changeTriggers)) error$1('"changeTriggers" (first argument) needs to be an object, got ' + getType(changeTriggers) + ' instead: \n ' + _JSON$stringify(arguments, null, 2));

    if (!isSet(triggerFunction)) error$1('"triggerFunction" (second argument) cannot be null or undefined: \n ' + _JSON$stringify(arguments, null, 2));

    if (!isFunction(triggerFunction)) error$1('"triggerFunction" (second argument) needs to be a function, got ' + getType(triggerFunction) + ' instead: \n ' + _JSON$stringify(arguments, null, 2));

    // Unpack change triggers (to get to the change triggers slim-redux can use)
    var changeTriggersInitialized = {};

    _Object$keys(changeTriggers).map(function (key) {
        if (changeTriggers[key].type === CHANGE_TRIGGER) changeTriggersInitialized[key] = changeTriggers[key].creatorFunction();else error$1('Issue with changeTriggers[' + key + ']: Does not seem to be a changeTrigger created with the slim-redux-react API. ' + SLIM_REDUX_COMP_NOTICE + ' \n ' + _JSON$stringify(_arguments, null, 2));
    });

    var createAsyncChangeTrigger = function createAsyncChangeTrigger() {
        return slimRedux.asyncChangeTrigger(changeTriggersInitialized, triggerFunction);
    };
    return {
        type: ASYNC_CHANGE_TRIGGER,
        creatorFunction: createAsyncChangeTrigger
    };
}

exports.connect = connect;
exports.Provider = reactRedux.Provider;
exports.subscription = subscription$1;
exports.calculation = calculation$1;
exports.changeTrigger = changeTrigger$1;
exports.asyncChangeTrigger = asyncChangeTrigger$1;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.umd.js.map
