import React from 'react';
import { slimReduxReact } from 'slim-redux-react';
import counterChangeTriggers from './counterChangeTriggers';
import { ComplexCounter } from './ComplexCounter';

const ComplexCounterContainer = (props) => {
  // Asynchronous code that utilizes change triggers however
  const increaseAsync = () => setTimeout(() => props.increaseCounter(), 500);
  const decreaseAsync = () => setTimeout(() => props.decreaseCounter(), 500);

  // Modifying a subscribed to value before passing it down
  const counter = props.counter + 100;

  // Notice how we pass in a few new props but also the ones that were added by slimReduxReact()
  var containerProps = {...props, increaseAsync, decreaseAsync, counter};

  return <ComplexCounter {...containerProps}/>
}

export default slimReduxReact({
  component: ComplexCounterContainer,
  subscriptions: { counter: 'state'},
  changeTriggers: counterChangeTriggers,
});
