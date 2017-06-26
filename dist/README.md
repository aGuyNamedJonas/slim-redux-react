slim-redux-react
================

[![CircleCI Status](https://circleci.com/gh/aGuyNamedJonas/slim-redux-react.svg?style=shield&circle-token=:circle-token)](https://circleci.com/gh/aGuyNamedJonas/slim-redux-react)

>  🢂 Watch on Youtube: [**slim-redux-react in action (DEMO) [45 min]**](https://youtu.be/JvN2Jr9dMSE)  
> 🢂 Read on Medium: [**Introducing slim-redux-react — a faster, more concise way of building redux based react apps [6 min]**](https://medium.com/@aGuyNamedJonas/introducing-slim-redux-react-a-faster-more-concise-way-of-building-redux-based-react-apps-bed14f7c88bf)


Official react bindings for [slim-redux](https://github.com/aGuyNamedJonas/slim-redux) which gives components access to the store through `subscriptions` and lets them modify the state through `change triggers`.

`slim-redux-react` uses [reselect](https://github.com/reactjs/reselect) for implementing subscriptions efficiently and `slim-redux` [change triggers](https://github.com/aGuyNamedJonas/slim-redux#step-1-create-a-change-trigger) to make store changes a breeze.

____

# <a name="toc"></a>Table of Contents
* [Quick start](#quick-start)
* [Motivation](#motivation)
* [API Reference](#api-reference)
* [Recipes](#recipes)
  * [Async code & change triggers](#bundle-change-definitions)
  * [Simple vs. complex container components](#heavy-light-container-components)
  * [Using slim-react-redux in existing react-redux apps](#integrating-into-existing-apps)
  * [Slim-redux recipes](#slim-redux-recipes)
* [Examples](#examples)
* [Future Development](#future-development)
* [Contribute](#contribute)
* [Feedback](#feedback)
* [License](#license)

____

## <a name="quick-start"></a>Quick Start  
To get started, have a look at the below code which is directly taken from the [counter example](https://github.com/aGuyNamedJonas/slim-redux-react/tree/master/examples/counter). It takes just two steps to get started with slim-redux-react:  

**Step #1: Call createSlimReduxStore(initialState, existingRootReducer, middleware)**  

```javascript
// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import CounterContainer from './Counter';
import { createSlimReduxStore, Provider } from 'slim-redux';

// Create the store, give it an initial state of 0 (and make redux store visible in redux-devtools browser extension)
const store = createSlimReduxStore(0, null, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

ReactDOM.render(
  <div>
    <Provider store={store}>
      <CounterContainer/>
    </Provider>
  </div>  ,
  document.getElementById('root')
);
```

Calling `createSlimReduxStore()` sets up a redux store with the slim-redux functionality injected (like its internal reducer function) but with all the functionality you know from redux.

Overall nothing fancy here, but notice that the second argument takes an existing rootReducer. slim-redux was specifically designed to be able to easily live alongside an existing redux setup. Time for...

**Step #2: Connect our react component to slim-redux**  
*(using `slimReduxReact()`)*
```javascript
// Counter.js
import React, { Component, PureComponent } from 'react';
import { slimReduxReact } from 'slim-redux-react';

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

  // Subscriptions map parts of the state to props. The key of the object is the
  // propname, the value is the part of the state (separated by dots) that you
  // want to map to that prop. Here: Map state --> props.counter
  // Other Example: { completedTodos: 'state.todos.done'} etc.
  subscriptions: { counter: 'state'},

  // Change triggers are a slim-redux concept which combines defining actions and
  // reducers in one place. Notice how it's an object with definitions - normally
  // you would export these change trigger definitions from a separate file.
  changeTriggers: {
    increaseCounter: {
      actionType: 'INCREMENT',
      reducer: (state) => {
        return state + 1;
      }
    },
    decreaseCounter: {
      actionType: 'DECREMENT',
      reducer: (state) => {
        return state - 1;
      }
    }
  },
});
```

Subscriptions are probably self-explanatory but feel free to check out the [API reference](#api-reference) and [examples](#examples) to a few more examples on how subscriptions are used.  

Change triggers are a `slim-redux` concept which bundles action and reducer definitions in one place. You should be able to pick up everything you need to know about change triggers by [reading the intro in the slim-redux repo](https://github.com/aGuyNamedJonas/slim-redux#slim-redux).

**Quick reminder:** What you see above is the [counter example](https://github.com/aGuyNamedJonas/slim-redux-react/tree/master/examples/counter) which you can just `npm install` and then `npm start`. Might be quicker than setting it up yourself :)   

<br><br>
[^ Table of Contents ^](#toc)


## <a name="motivation"></a>Motivation  
While I love the general idea of redux in conjunction with react, I always struggled with the boilerplate overhead of react-redux quite a bit. I would even go as far as saying that redux setups pretty often were [incredibly confusing](https://github.com/aGuyNamedJonas/slim-redux#motivation) to me even though the [basic principles behind redux](http://redux.js.org/docs/introduction/ThreePrinciples.html) are incredibly simple.  

What made me especially mad is that more often than not the operations performed on the redux store were incredibly simple object modifications. Especially for small changes in the store the regular overhead in react-redux was really frustrating to me.  

When I read through the [core principles of redux](http://redux.js.org/docs/introduction/ThreePrinciples.html) I realized that the way that we work with redux & react-redux can be re-packaged to a much slimmer interface without going against the basic design principles behind redux.

Ultimately what motivated me to write [slim-redux](https://github.com/aGuyNamedJonas/slim-redux) & slim-redux-react is to hopefully allow teams to much more efficiently work with redux while not having to refactor their existing state management system which is often not an option.

<br><br>
[^ Table of Contents ^](#toc)


## <a name="api-reference"></a>API Reference  
Since slim-redux-react builds on slim-redux, it might be worth checking out the [API reference for slim-redux](https://github.com/aGuyNamedJonas/slim-redux#api-reference) as well.

**Important:** In order for slim-redux-react to work, you need to wrap your application code in the `<Provider/>` component! [🢂 Example](https://github.com/aGuyNamedJonas/slim-redux-react/blob/master/examples/counter/src/index.js#L12)

### slimReduxReact(parameters)
Returns a react component that wraps the component in `parameters.component` and provides it with props that contain change triggers and subscriptions, according to `parameters.subscriptions` and `parameters.changeTriggers`.  

**Parameters:**
* *parameters.component*: The component to wrap
* *parameters.subscriptions*: Object in which the keys are the prop name to use when passing the subscribed to part of the state to the wrapped component. The value is a locator which determines which part of the store to subscribe to: "store.<property of store>.<sub property of store>...." (e.g. completedTodos: "store.todos.completed")
* *parameters.changeTriggers*: Object in which the keys are the prop name to use when passing the change trigger to the wrapped component. The value is a change trigger definition which is an object that follows the [slim-redux API for registering change triggers](https://github.com/aGuyNamedJonas/slim-redux#storecreatechangetriggerparameters)

**Returns:** A wrapper component which provides the `parameters.component` component with subscription values and change triggers through props.  

**Example:**
```javascript
import React, { Component, PureComponent } from 'react';
import { slimReduxReact } from 'slim-redux-react';

export const Counter = (props) => (/* ... */)

export default slimReduxReact({
  component: Counter,
  subscriptions: { counter: 'state'},

  changeTriggers: {
    increaseCounter: {
      actionType: 'INCREMENT',
      reducer: (state) => {
        return state + 1;
      }
    },
    decreaseCounter: {
      actionType: 'DECREMENT',
      reducer: (state) => {
        return state - 1;
      }
    }
  },
});
```
See the [complete counter example](https://github.com/aGuyNamedJonas/slim-redux-react/tree/master/examples/counter) or find out how you can [integrate asynchronous code and processing of subscription values](#heavy-light-container-components) into your slim-redux-react code.

### Provider
The [Provider component from `react-redux`](https://github.com/reactjs/react-redux/blob/master/docs/api.md#provider-store).


<br><br>
[^ Table of Contents ^](#toc)


## <a name="recipes"></a>Recipes  
This section features ideas on how to solve certain challenges when working with slim-redux-react as well as a few suggestions on how to make the most of slim-redux-react.

### <a name="bundle-change-definitions"></a>Async code & change triggers
The beauty of change triggers is that they are supposed to *really* trigger a change in your store. Actions and action creators (especially when working with middleware like [redux-thunk](https://github.com/gaearon/redux-thunk)) often tend to not guarantee a store change anymore.  

Instead often times a change creator function or even dispatching an action will lead to asynchronous side effects before eventually triggering an action that *actually* modifies the store.  

So if change triggers are designed to trigger a store change everytime they are called, how can we deal with asynchronous scenarios?  

The basic idea is that you move your asynchronous code out of actions into the container components of your app which in turn call the change triggers they need:  

```javascript
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
*Code taken from the [simple-complex-containers](https://github.com/aGuyNamedJonas/slim-redux-react/tree/master/examples/simple-complex-containers) example (from [ComplexCounterContainer.js](https://github.com/aGuyNamedJonas/slim-redux-react/blob/master/examples/simple-complex-containers/src/ComplexCounterContainer.js))*

In this example you can see a container component that wraps `<ComplexCounter/>` and uses the change triggers it gets from `slimReduxReact({component: ComplexCounterContainer, /*...*/})` to build the `increaseAsync()` and `decreaseAsync()` functions which then get passed to the wrapped component `<ComplexCounter/>`.  

While this might be a deviation from how we usually build react-redux apps where the async code often lives inside of middleware-dependent code reacting to actions, I believe that this slim-redux-react approach is easier to work with.  

To me personally it's easier to have this code directly accessible and pass it down as props directly, instead of having intercepted actions lead to asynchronous side-effects which is often somewhat hidden in the background.

<br><br>
[^ Table of Contents ^](#toc)

### <a name="heavy-light-container-components"></a>Simple vs. complex container   components  
This recipe aims at exploring a pattern which was used in the previous recipe: Simple container vs. Complex container components.

*(This recipe assumes knowledge of the [presentational vs. container concept](http://redux.js.org/docs/basics/UsageWithReact.html#presentational-and-container-components) from redux)*  

#### Simple Containers
Simple containers is what you get when you default export a presentational component that you called `slimReduxReact()` on directly:  

```javascript
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
*Code taken from the [simple-complex-containers](https://github.com/aGuyNamedJonas/slim-redux-react/tree/master/examples/simple-complex-containers) example (from [SimpleCounter.js](https://github.com/aGuyNamedJonas/slim-redux-react/blob/master/examples/simple-complex-containers/src/SimpleCounter.js))*  

In this example you can see a `<Counter/>` component being defined and then hooked up with slim-redux through the call of `slimReduxReact({component: Counter, /* ... */})` and exported as the default.  

Through the slim nature of `slimReduxReact()` it's possible to comfortably export the container- and the presentation component from the same file.    

To use the containerized version of counter, you use the default import:  
`import CounterContainer from './Container'`. To use the presentational version of counter (i.e. for testing or re-using), you use the named import: `import { Counter } from './Container'`.  

With this approach you should be able to make your code base a bit slimmer by getting around the `...Container.js` files that you'd usually create when `connect()`ing a presentational component to redux.  

But what if a simple mapping to parts of the state (=subscriptions) and direct access to change triggers is not enough?  

#### Complex Containers
Sometimes you want to derive data off of subscribed-to state values or need to provide a component with asynchronous callbacks that might eventually call a change trigger.  

For those use cases I hope you will find the complex container pattern useful:

```javascript
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
*Code taken from the [simple-complex-containers](https://github.com/aGuyNamedJonas/slim-redux-react/tree/master/examples/simple-complex-containers) example (from [ComplexCounterContainer.js](https://github.com/aGuyNamedJonas/slim-redux-react/blob/master/examples/simple-complex-containers/src/ComplexCounterContainer.js))*

Instead of using `slimReduxReact({ /* ... */ })` directly on our presentational component (in this case `<ComplexCounter/>`) we instead create a container component that wraps our presentational component and applies `slimReduxReact()` on itself as the default export.  

Through this approach we can derive data off of our subscriptions (in this case we simply increase the counter by 100) before passing them down and can also create async callbacks that ultimately trigger changes in the store (take a look at `increaseAsync()` and `decreaseAsync()`).  

Note that in this pattern you can also directly pass through subscriptions and change triggers (notice how the `const containerProps = /* ... */` also include the props we get from `slimReduxReact()`).


#### To summarize...
Use simple containers in your app as much as possible (as I think they can help keep your code base a bit slimmer) and use complex containers for when you need to power up your subscriptions and change triggers a notch.  

Also make sure to check out the full [simple-complex-containers](https://github.com/aGuyNamedJonas/slim-redux-react/tree/master/examples/simple-complex-containers) example.

<br><br>
[^ Table of Contents ^](#toc)

### <a name="integrating-into-existing-apps"></a>Using slim-react-redux in existing react-redux apps  
Glad you came here to this very recipe: This is the gospel - the good message - of slim-redux & slim-redux-react: You can use it **alongside your existing redux projects!**  

If you already have a root reducer in place, just pass it into `createSlimReduxStore()`:
```javascript
const store = createSlimReduxStore(initialState, yourAlreadyExistingRootReducer)
```
slim-redux takes care of merging your already existing root reducer together with the internal slim-redux reducer.  

**Got middleware?** Well guess what....  
```javascript
const store = createSlimReduxStore(initialState, yourAlreadyExistingRootReducer, yourAlreadyExistingMiddleware)
```

That's how easy it is :) You can actually see that middleware part in action here: [Including the redux devtools browser extension in the counter example](https://github.com/aGuyNamedJonas/slim-redux-react/blob/master/examples/counter/src/index.js#L8)

Also make sure to check out the `createSlimReduxStore()` [API reference](https://github.com/aGuyNamedJonas/slim-redux#createslimreduxstoreinitialstate-existingrootreducer-enhancer).

<br><br>
[^ Table of Contents ^](#toc)

### <a name="slim-redux-recipes"></a>Slim-redux recipes  
Since slim-redux-react is the wrapper for `slim-redux`, there are even more recipes for you to check out- slim-redux specific recipes YAY! :)  

#### 🢂 [slim-redux recipes](https://github.com/aGuyNamedJonas/slim-redux#recipes)

<br><br>
[^ Table of Contents ^](#toc)


## <a name="examples"></a>Examples  
#### 🢂 [Examples folder](https://github.com/aGuyNamedJonas/slim-redux-react/tree/master/examples)

<br><br>
[^ Table of Contents ^](#toc)


## <a name="future-development"></a>Future Development  
Nothing planned yet so far. I'll have to wait for [feedback](#feedback) or [contributions](#contribute) coming in - I'll keep this updated!

## <a name="contribute"></a>Contribute  
Want to contribute something to this project? AWESOME! Just open up a pull request or an issue and then let's figure out together whether or not it makes sense to add it to the project!


## <a name="feedback"></a>Feedback  
Got a question, feedback, improvement suggestion, found a bug, wanna share a cool idea?  
[Create an issue](https://github.com/aGuyNamedJonas/slim-redux/issues/new)

**- OR -**

[Get in touch on twitter](https://twitter.com/intent/tweet?screen_name=aGuyNamedJonas&text=%23slim-redux%20)  

[(Optional) follow me on twitter (@aGuyNamedJonas)](https://twitter.com/aGuyNamedJonas)


## <a name="License"></a>License
MIT  

<br><br>
[^ Table of Contents ^](#toc)
