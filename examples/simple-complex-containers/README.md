Simple vs. Complex Containers
=============================

This example shows two different kinds of containers that are possible and suggested for `slim-redux-react`.  

Not sure what I mean by "containers / container components" in this context?  
[It's a redux term](http://redux.js.org/docs/basics/UsageWithReact.html#presentational-and-container-components) for separating your components into two kinds: Components that just display stuff and call callbacks (view components) and components that usually don't have any visual output, but provide data and callbacks to a view component that they wrap (container components).

### Simple container components
The simple container is just a component with direct access to a few subscriptions and change triggers:  

```javascript
// SimpleCounter.js
import React, { Component, PureComponent } from 'react';
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
```
In the file where we want to use the counter as a container component, we just use the default import:    
`import SimpleCounterContainer from './SimpleCounter.js';`.  

We call this a **simple container** since change triggers and subscriptions are directly passed to the `Counter` component through `slimReduxReact()`.

The only thing we're doing in this case to turn the `Counter` into `CounterContainer` is the call to `slimReduxReact()` - that's why it's called **simple**.

### Complex Components
While the containerization of the SimpleCounter happens "inline" in the default export by calling `export default slimReduxReact()` pretty often that won't be enough.  

How can we introduce asynchronous behavior into change triggers or modify / derive data from the subscriptions before using them? It's pretty easy actually: Just build an explicit container component that provides the asynchronous code and the modified subscription data:  

```javascript
// ComplexCounter.js
import React, { Component, PureComponent } from 'react';
import { slimReduxReact } from 'slim-redux-react';
// import { Counter } from './SimpleCounter';
import counterChangeTriggers from './counterChangeTriggers';

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
// No default export in this case

//--------------------------------------------------
// ComplexCounterContainer.js
import React, { Component } from 'react';
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

```

Here you can see how to provide asynchronous functionality to your view component and also modify the subscibed to state before passing it along. Neat huh?
