import React from 'react';

export const ComplexCounter = (props) => (
  <div>
    <h1>Current Counter: {props.counter}</h1>
    <button onClick={e => props.decreaseCounter()}>-</button>
    <button onClick={e => props.increaseCounter()}>+</button>
    <br/>
    <button onClick={e => props.decreaseAsync()}>Decrease asynchronously</button>
    <button onClick={e => props.increaseAsync()}>Increase asynchronously</button>
  </div>
)

// No default export in this case, we'll provide this thing with subscriptions + change triggers in the container
