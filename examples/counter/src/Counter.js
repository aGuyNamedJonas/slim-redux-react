import React from 'react';
import { slimReduxReact } from 'slim-redux-react';
import counterChangeTriggers from './counterChangeTriggers';

// This could also be a regular or even a pure react component!
export const Counter = (props) => (
  <div>
    <h1>Current Counter: {props.counter}</h1>
    <button onClick={e => props.decreaseCounter()}>-</button>
    <button onClick={e => props.increaseCounter()}>+</button>
  </div>
)

export default slimReduxReact({
  component: Counter,
  subscriptions: { counter: 'state'},
  changeTriggers: counterChangeTriggers,
});
