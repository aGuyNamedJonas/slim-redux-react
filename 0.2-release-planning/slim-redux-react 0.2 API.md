# slim-redux-react 0.2 API
**Goals:**
 - Cleaner to use (replace argument objects with function parameters)
 - Safer to use (include argument checking in development)
 - Typed (include [flow typed lib defs](https://github.com/flowtype/flow-typed))

**Challenges of the implementation:**
- [ ] Needs to be performant
- [ ] Change triggers have to somehow react to external code dispatching an action with the type they were registered to, and needs to be fast when being called through a change trigger function
- [ ] When registering a change trigger, if the change trigger itself was not changed, make sure that handler is re-used (can be accomplished since change triggers now have to be wrapped inside of changeTrigger())

 ### connect(component, subscriptions, changeTriggers): containerComponent
 *(pka `slimReduxReact()`)*  

 **Description:** connects a visual react component to slim-redux and returns the containerized component.  

**Parameters:**
* `component`: The react component to be connected to slim-redux
* `subscriptions`: An object whose keys are the prop names that will be provided to the connected component which will contain the subscribed to state value. Keys can either be of the form `state.subkey.subkey` or can be computations
* `changeTriggers`: An object whose keys are the prop names that will be provided to the connected component which are the change trigger functions for the component to use. The change triggers passed in as the values of the object need to be either created with `changeTrigger()` or `asyncChangeTrigger()`

**Returns:**  
The containerized react component that will get the subscriptions and change triggers provided as props.

**Example:**  
```javascript
<Insert example>
```


 **Reasons for change:**
 1. `Single object parameter --> Actual parameters`: Having to write out the actual object keys is the kind of overhead slim-redux-react is aiming to prevent. It's better readable, but only as long as people aren't used to using slim-redux-react. Providing function parameters, instead of a single object seems a lot cleaner and like a better way to design an API on top of that
 2. `slimReduxReact --> connect`: connect() is the function name that redux users are used to from react-redux. So we should use the same to not introduce yet another vocabulary. Also users will import connect from the slim-redux-react module, no reason why the name of the module should be used as the connect() function


# slim-redux 0.2 API
### changeTrigger()
**Description:** Creates and returns a change trigger to be used in `store.registerChangeTrigger()` or in `connect()`.

**Parameters:**  
**Returns:**  
**Example:**  
```javascript
// changes/todo.js
import { changeTrigger } from 'slim-redux';

export const addTodo = changeTrigger('ADD_TODO', (label) => {
  // This reducer function has access to state and to the action which it triggered
  const newId = state.todos.map((max, todo) => Math.max(max, todo,id), 0) + 1;
  return {
    ...state,
    todos: [
      ...state.todos,
      {id: newId, label: label, checked: false},
    ]
  };
});

// main.js
import { addTodo } from './changes/todo';
// Initialize store etc.
const addTodo = store.registerChangeTrigger(addTodo);
```


**Reasons for change:**  
Before change triggers were just plain objects which was fine, but I feel like it's easier and clearer to read when change triggers are "created" through a function. Also this gives us the chance to provide simple change triggers and async change triggers. We also get the chance to check change triggers on initialization and we can also optimize in the future in whatever direction we want.

**Implementation requirements:**  
This function should somehow be able to make it possible to re-use change triggers that haven't changed. This should return some sort of ID under which to find this change trigger if it had been registered previously. It's a little unclear how that could work though.

### asyncChangeTrigger(actionType, changeTriggers, reducer)
**Description:**  This registers an asynchronous change trigger which (in addition to the parameters a regular `changeTrigger()` function takes) also takes an object with change trigger functions which will be provided to the change trigger function to use.  

The reason why this is a separate API call instead of allowing users to pass other change triggers to `changeTrigger()` is that hopefully like this users will be able to easily separate async change triggers from "plain" or "straight" change triggers. The hope is as well that these two categories will be treated as separate, so that it's easier for users to know upfront (just by the location of their change triggers) whether the change trigger can be expected to have side-effects (=asyncChangeTrigger) or not (=changeTrigger).

**Parameters:**  
* `actionType`: A string, representing the type of the action that this change triggers reacts to or dispatches when being called through a change trigger function (e.g. `ADD_TODO_ASYNC`)
* `changeTriggers`: An object with change triggers that this change trigger will be provided with. The keys are the names under which the change trigger functions will be made available, the values are change triggers, either created with `changeTrigger()` or `asyncChangeTrigger()`
* `reducer`: A reducer function with the signature `action payload` --> `new state`. This function will be provided with access to the `state` and the `action` which it was triggered by. The parameters are really about the payload this reducer function takes.

**Returns:**  
An async change trigger function to be used by `store.registerChangeTrigger()` or `connect()`

**Example:**  
```javascript
// async/todo.js
import { asyncChangeTrigger } from 'slim-redux-react';
import { addTodo, addTodoConfirmed } from '../changes/todo';

// First argument is a change trigger mapping like in slimReduxReact()
export const addTodo = asyncChangeTrigger('ADD_TODO_SERVER_SYNC', { addTodo, addTodoConfirmed }, (title) => {
  // Notice how we have access to the state inside of the reducer function
  const newId = state.todos.filter((max, value) => Math.max(max, value), 0) + 1;

  // Call our first change trigger (also notice how change triggers now take arguments!)
  addTodo(newId, title);

  fetch(`/v1/todos`, {
    method: 'post',
    /* ... */
  ).then(data => {
    // Calling our second change trigger to confirm we added the task on the server
    addTodoConfirmed(newId);
  })
});

// components/TodoList.js
import { connect } from 'slim-redux-react';
import { addTodo } from '../async/todo';

// Our TodoList component
const TodoList = (props) => ( /* ... */ );

// When exporting the TodoList container we pass addTodo alongside other change triggers
export const connect(TodoList, { /* Subscriptions */ }, { addTodo })
```
**Reasons for change:** Previously it was not possible to use change triggers inside of other change triggers are the goal was to have change triggers be simple, side-effect free state changes.

**Implementation requirements:**  
This function should somehow be able to make it possible to re-use change triggers that haven't changed. This should return some sort of ID under which to find this change trigger if it had been registered previously. It's a little unclear how that could work though.
The action type can be used as an ID for this change trigger though.

### computation(subscriptionMap, computation)
**Description:**  The next evolution of subscriptions. While subscriptions in the previous version were a simple mapping of a state location to a value passed down to react components, computations actually are a collection of subscriptions which are passed to a computation function which returns a value derived off of those subscriptions.  
Whenever one of the subscriptions changes, the computation function is re-evaluated.

**Parameters:**  
* subscriptionMap: An object which maps subscriptions to variable names. Subscriptions are strings of similar to "state.todos.completed" which address (a part of) the state. Whenever that part of the state changes, the computation is re-triggered. The keys of this object are the names under which the computation function will get access to the part of the state the string (=value) is addressing.

**Returns:**  
A computed values that can be used in the same way as subscriptions inside of `connect()` and in `state.registerSubscription()`.

**Example:**  
```javascript
// computations/todo.js
import { computation } from 'slim-redux';

export const visibleTodos = computation({
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

**Reasons for change:** Subscriptions are nice and simple, but not very powerful. With computations it is possible to calculate derived (=computed) values off of subscriptions. The next evolution of this might be to even allow computations access to change triggers, but for now computations are just an extension of the subscription model to allow for more powerful subscriptions to the state.

**Implementation requirements:** This should use the reselect library (unless there is a good reason against that) since we have to assume for now that this is the proven and performant way of how these kind of computations can be built. Also this `computation()` function feels like it does the same as reselect essentially, so let's implement `computation()` as a store-front to reselect for now :)

### store.registerChangeTrigger()
**(Deprecated!)**

**Reasons for change:** `registerChangeTrigger()` is an uneccessary step. As a user there is no reason why we would want to first register a change trigger before we use it for the first time.  
Instead change triggers when called will look for the store instance in the global scope, unless there is a store instance provided in the change trigger call.

**Implementation requirements:**  
This needs to be as performant or even faster than combineReducers (redux) since this really can become a bottleneck if not implemented with an absolute kick-ass performance: https://github.com/reactjs/redux/blob/master/src/combineReducers.js
