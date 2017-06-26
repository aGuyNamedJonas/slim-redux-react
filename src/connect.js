import React from 'react';
import { error as _err } from './util';

export function connect(component, subsAndCalcs, changeTriggers){
    const displayName = component.displayName || component.name || 'SlimReduxReact',
          error       = msg => _err(`<${displayName}/>`, msg);

    class SlimReduxConnector extends React.Component {
        constructor(props, context){
            super(props);

            // Check for store instance
            if(!context.store)
                error(`No store found in context. Did you forget to wrap your code in the <Provider> component?`);

            const store = context.store;

            // Setup initial state
            const initialState = {};

            // Go through subscriptions and calculations and set them up to feed into the state
            Object.keys(subsAndCalcs).map(key => {
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
            });

            this.wrappedChangeTriggers = {};

            // Go through change triggers and wrap them to use the current store instance
            Object.keys(changeTriggers).map(key => {
                wrappedChangeTriggers[key] = function(...params){
                    // Creating a new closure to preserve the store instance
                    const ct = changeTriggers[key];

                    // We only pass down the parameters to the change trigger if the change trigger accepts any
                    if(ct.length === 1)
                        ct(store);
                    else
                        ct(...params, store);
                    }
            });
        }

        componentDidMount() {}

        render() {
            return <WrappedComponent {...this.props} {...this.wrappedChangeTriggers} {...this.state}/>
        }
    }

    SlimReduxConnector.displayName = `SlimReduxConnector${displayName}`;

    SlimReduxConnector.contextTypes = {
        store: React.PropTypes.object
    }

    return SlimReduxConnector;
}