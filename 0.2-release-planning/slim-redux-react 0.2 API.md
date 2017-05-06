# slim-redux-react 0.2 API
**Goals:**
 - Cleaner to use (replace argument objects with function parameters)
 - Safer to use (include argument checking in development)
 - Typed (include [flow typed lib defs](https://github.com/flowtype/flow-typed))

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

### asyncChangeTrigger()
**Description:**  
**Parameters:**  
**Returns:**  
**Example:**  
**Reasons for change:**  

### computation()
**Description:**  
**Parameters:**  
**Returns:**  
**Example:**  
**Reasons for change:**  
