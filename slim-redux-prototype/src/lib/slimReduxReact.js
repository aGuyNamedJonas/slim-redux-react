import React from 'react';
import { getNotifyingSelectorCreator, areArgumentsShallowlyEqual } from './selector'

const subscribe = (subscriptions, store) => {

}

function slimReduxReact(params) {
  const WrappedComponent = params.component;
  const changeTriggers   = params.changeTriggers;
  const subscriptions    = params.subscriptions;

  console.log(`Subscription: ${JSON.stringify(subscriptions, null, 2)}`)

  const displayName = WrappedComponent.displayName || WrappedComponent.name || '';

  // TODO: Finish handling subscriptions!
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

    console.log(`Store subscriptions: ${JSON.stringify(storeSubscriptions, null, 2)}`)
    return state.todos;
  }

  const createNotifyingSelector = getNotifyingSelectorCreator();
  const checkSubscriptionSelector = createNotifyingSelector(
    getSubscriptions,
    data => data,
  );

  // TODO: Do processing of change triggers - in case it's not functions, but just change() parameters

  class SlimReduxConnector extends React.Component {
    constructor(props){
      super(props);
    }

    componentDidMount() {
      const initialSubscriptionState = checkSubscriptionSelector(this.context.store.getState())
      this.setState({
        ...initialSubscriptionState
      })
    }

    render() {
      console.log(`Did the store arrive in HOC? ${this.context.store.TEST}`)
      return <WrappedComponent {...this.props} {...changeTriggers} />
    }
  }

  SlimReduxConnector.displayName = `SlimReduxConnector${displayName}`;

  SlimReduxConnector.contextTypes = {
    store: React.PropTypes.object
  }

  return SlimReduxConnector;
}

export default slimReduxReact;
