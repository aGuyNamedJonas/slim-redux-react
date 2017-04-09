import React from 'react';
import { getNotifyingSelectorCreator, areArgumentsShallowlyEqual } from './selector';

function slimReduxReact(params) {
  const WrappedComponent = params.component;
  const changeTriggers   = params.changeTriggers || {};
  const subscriptions    = params.subscriptions || {};

  const displayName = WrappedComponent.displayName || WrappedComponent.name || '';

  // Returns the appropriate part of the state for a string like "state.todo.active"
  const _getStateFromSubscriptionString = (subscriptionString, state) => {
    const subStringParts = subscriptionString.split('.');
    var currentPath = 'state';
    var stateFromString = state;

    for(var i=1; i < subStringParts.length; i++){
      const nextPath = subStringParts[i];
      currentPath += `.${nextPath}`;

      if(!(nextPath in stateFromString))
        console.error(`*** Error in slimReduxReact container ${displayName}:\nCannot find path "${currentPath} in state.\nState: ${JSON.stringify(state, null, 2)}"`);

      stateFromString = stateFromString[nextPath];
    }

    return stateFromString;
  }

  // Retrieves the data for the subscriptions, first part of the subscription selector
  const getSubscriptions = (state) => {
    var storeSubscriptions = {};
    Object.keys(subscriptions).map(subscription => storeSubscriptions[subscription] = _getStateFromSubscriptionString(subscriptions[subscription], state))
    return storeSubscriptions;
  }

  // Create subscrption selector
  const createNotifyingSelector = getNotifyingSelectorCreator();
  const checkSubscriptionSelector = createNotifyingSelector(
    getSubscriptions,
    subscriptionData => subscriptionData,
  );

  // Create change creators    TODO: change creators could also be functions to mock stuff!!
  const registerChangeTriggers = (changeTriggers, change) => {
    var registeredChangeTriggers = {}
    Object.keys(changeTriggers).map(changeTrigger => registeredChangeTriggers[changeTrigger] = change(changeTriggers[changeTrigger]))

    return registeredChangeTriggers;
  }

  class SlimReduxConnector extends React.Component {
    constructor(props, context){
      super(props);

      if(!context.store)
        console.error(`*** Error in SlimReduxConnector component: No store found in context. Did you forget to wrap your code in the <Provider> component?`);

      const initialSubscriptionState = checkSubscriptionSelector(context.store.getState())
      this.state = { ...initialSubscriptionState.data }

      this.registeredChangeTriggers = registerChangeTriggers(changeTriggers, context.store.createChangeTrigger)
    }

    componentDidMount() {
      // SUBSCRIBE THIS MOTHERFUCKER TO SUBSCRIPTION CHANGES!
      this.context.store.subscribe(() => {
        const subscriptionState = checkSubscriptionSelector(this.context.store.getState())

        if(subscriptionState.hasChanged)
          this.setState({
            ...this.state,
            ...subscriptionState.data,
        })
      })
    }

    render() {
      return <WrappedComponent {...this.props} {...this.registeredChangeTriggers} {...this.state}/>
    }
  }

  SlimReduxConnector.displayName = `SlimReduxConnector${displayName}`;

  SlimReduxConnector.contextTypes = {
    store: React.PropTypes.object
  }

  return SlimReduxConnector;
}

export default slimReduxReact;
