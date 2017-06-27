import React from 'react';
import { error as _err, isObject, getType } from './util';
import { SUBSCRIPTION, CALCULATION, CHANGE_TRIGGER, ASYNC_CHANGE_TRIGGER } from './constants'; 

export function connect(component, stuff){
    const WrappedComponent = component,
          displayName      = component.displayName || component.name || 'SlimReduxReact',
          error            = msg => _err(`<${displayName}/>`, msg);

    class SlimReduxConnector extends React.Component {
        constructor(props, context){
            super(props);

            debugger;

            // Check for store instance
            if(!context.store)
                error(`No store found in context. Did you forget to wrap your code in the <Provider> component?`);

            const store = context.store;

            // Setup initial state
            const initialState = {};

            // Setup empty change trigger object
            this.wrappedChangeTriggers = {};

            // Make sure the stuff object is an object
            if(!isObject(stuff))
                error(`"stuff" (second parameter) is expected to be of type "object", got ${getType(stuff)} instead: \n ${JSON.stringify(stuff, null, 2)}`);
            
            // Go through the stuff object
            Object.keys(stuff).map(key => {
                console.log(`💩💩💩 Processing prop: "${key}" of type ${stuff[key].type}`);

                // Make sure that the API functions have been used!
                if(!stuff[key].type || !(stuff[key].type === SUBSCRIPTION || stuff[key].type === CALCULATION || stuff[key].type === CHANGE_TRIGGER || stuff[key].type === ASYNC_CHANGE_TRIGGER))
                    error(`No "type" field found in stuff-object element "${key}". Make sure to use the slim-redux-react API functions to create subscriptions, calculations, and (async) change triggers! \n ${JSON.stringify(stuff, null, 2)}`);

                // Setup subscription / calculation
                if(stuff[key].type === SUBSCRIPTION || stuff[key].type === CALCULATION) {
                    const stateKey = key;

                    // Create a closure so that the stateKey is still available after this setup code has executed
                    (function(){
                        // Hook it up to the state
                        const getInitialValue = subsAndCalcs[key](value => {
                            this.setState({...this.state, [stateKey]: value});
                        }, store);

                        // Get initial state
                        initialState[key] = getInitialValue();
                    })()
                }

                // Setup change trigger / async change trigger
                if(stuff[key].type === CHANGE_TRIGGER || stuff[key].type === ASYNC_CHANGE_TRIGGER) {
                    this.wrappedChangeTriggers[key] = function(...params){
                        // Creating a new closure to preserve the store instance
                        const ct = stuff[key].creatorFunction();

                        // We only pass down the parameters to the change trigger if the change trigger accepts any
                        if(ct.length === 1)
                            ct(store);
                        else
                            ct(...params, store);
                        }
                    }
                }
            })

            // Set initial state
            this.state = initialState;





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
        }

        componentDidMount() {}

        render() {
            debugger;
            return <WrappedComponent {...this.props} {...this.initialState} {...this.wrappedChangeTriggers} {...this.state}/>
        }
    }

    SlimReduxConnector.displayName = `SlimReduxConnector${displayName}`;

    SlimReduxConnector.contextTypes = {
        store: React.PropTypes.object
    }

    return SlimReduxConnector;
}