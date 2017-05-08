#slim-redux API v0.2
### connect(component, subscriptions, changeTriggers): containerComponent
*(pka `slimReduxReact()`)*  

**Description:** connects a visual react component to slim-redux and returns the containerized component. This function had the name `slimReduxReact()` but was renamed to `connect()` to avoid introducing too many new names.

**Parameters:**
* `component`: The react component to be connected to slim-redux
* `subscriptions`: An object whose keys are the prop names that will be provided to the connected component which will contain the subscribed to state value. Keys can either be of the form `state.subkey.subkey` or can be computations
* `changeTriggers`: An object whose keys are the prop names that will be provided to the connected component which are the change trigger functions for the component to use. The change triggers passed in as the values of the object need to be either created with `changeTrigger()` or `asyncChangeTrigger()`

**Returns:**  
The containerized react component that will get the subscriptions and change triggers provided as props.

**Example:**  
```javascript
// components/TodoList.js
import { connect } from 'slim-redux-react';
import { addTodo } from '../async/todo';
import { visibleTodos } from '../computations/todo';

// The TodoList react component
const TodoList = (props) => ( /* ... */ );

// Connecting the visual component to the store
export default connect(TodoList, { visibleTodos, filter: 'state.filter' }, { addTodo });
```

### compute(subscriptionMap, computation)
**Description:**  The next evolution of subscriptions. While subscriptions in the previous version were a simple mapping of a state location to a value passed down to react components, computations actually are a collection of subscriptions which are passed to a computation function which returns a value derived off of those subscriptions.  
Whenever one of the subscriptions changes, the computation function is re-evaluated.

**Parameters:**  
* `subscriptionMap`: An object which maps subscriptions to variable names. Subscriptions are strings of similar to "state.todos.completed" which address (a part of) the state. Whenever that part of the state changes, the computation is re-triggered. The keys of this object are the names under which the computation function will get access to the part of the state the string (=value) is addressing.
* `computation`: Function without any parameters that will be invoked with the subscriptions as values and returns the computed / derived values off of those subscriptions. Note that this function does not have general access to the state, only to the subscribed to parts of the state.

**Returns:**  
A computed values that can be used in the same way as subscriptions inside of `connect()` and in `state.registerSubscription()`.

**Example:**  
```javascript
// computations/todo.js
import { compute } from 'slim-redux-react';

export const visibleTodos = compute({
  todos: 'state.todos',
  filter: 'state.filter',
}, () => {
  // Notice how this function has no parameters, but returns a state computation
  return todos.filter(todo => (filter === 'ALL' || ('filter' === 'COMPLETED' && todo.completed) || (filter === 'OPEN' && !todo.completed)))
});

// components/TodoList.js
import { connect } from 'slim-redux-react';
import { addTodo } from '../async/todo';
import { visibleTodos } from '../computations/todo';

// The TodoList react component
const TodoList = (props) => ( /* ... */ );

// Connecting the visual component to the store
export const connect(TodoList, { visibleTodos }, { addTodo })
```

###Provider
**Description:** The regular Provider component that you're used to from react-redux. This is actually just a convenience export, directly taken from react-redux, so you can easily provide a store instance to your app.

**Example:**
```javascript
// index.js
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import { createSlimReduxStore } from 'slim-redux';
import { Provider } from 'slim-redux-react';

// Creating a slim-redux store with initial state and devtools installed
const store = createSlimReduxStore({todos:[]}, {
  middleware: window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
});

ReactDOM.render(
  <div>
    <Provider store={store}>
      <App/>
    </Provider>
  </div>  ,
  document.getElementById('root')
);
```
