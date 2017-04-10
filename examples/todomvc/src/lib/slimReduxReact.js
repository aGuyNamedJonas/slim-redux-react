import React from 'react';

const slimReduxReact = function(Component){
  /*
      component: App,
      subscriptions: {
        todos: 'store.todos',
      },
      changeTriggers: TodoChangeCreators
  */

  return class slimReduxReactContainer extends React.Component {
    render() {
      return <Component {...this.props}/>
    }
  }

  // Create a component which wraps the passed in component
  // Add subscriptions to the neccessary things
  // Update the props of the wrapped component on update!
}

export default slimReduxReact;
