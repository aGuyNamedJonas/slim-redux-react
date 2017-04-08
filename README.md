slim-redux-react
================
[*Jump to Table of Contents*](#toc)  
These are the react bindings for (you've guessed it!) [slim-redux](https://github.com/aGuyNamedJonas/slim-redux) which have the same goal as slim-redux: Being less boilerplate-heavy, faster to code and easier to reason about than your typical redux setups, while being 100% redux compatible.

slim-redux-react uses two concepts to let react components interact with slim-redux (also works with your regular redux setup, see [Recipes](#recipes)):

### Concept #1: Subscriptions map parts of the state to props
*(aka mapStateToProps)*  

```javascript
import React from 'react';
import { slimReduxReact } from 'slim-redux-react';

// This is just a regular react component
// Notice how this accesses prop.todos to map out the tasks into the list!
const TodoList = (props) => {
  return (
    <div>
      <ul>
        { props.todos.map(todo => <li key={todo.id}>{todo.text}</li>) }
      </ul>
    </div>
  );
}

// This is how we map parts of the state to component properties in slim-redux-react
// Notice how >slim< and intuitive this is! Just a simple mapping that can live in the
// same file as the component it's "connecting" (<-- that's a react-redux term) to the
// redux store.
export default slimReduxReact({
  component: TodoList,
  subscriptions: {
    todos: 'state.todos',
  }
});
```
`subscriptions` map a part of the state to the component props. Anytime that part of the state updates, the props are updated as well.

slim-redux-react uses the popular [reselect](https://github.com/reactjs/reselect) library for calculating the subscriptions efficiently.

slim-redux-react was specifically designed to be as slim as possible.  
Ideally the react component code and the part connecting it to slim-redux can be imported from the same file:

```javascript
// Import the component connected to slim-redux through the default import
import TodoListContainer from './TodoList';

// Import just the react component (e.g. for testing)
import { TodoList } from './TodoList';
```


### Concept #2: Components change the store through change triggers  
*(aka mapDispatchToProps sort of)*  

**Change triggers are a slim-redux concepts which bundles actions and reducers in one place, get an intro to it here:** [slim-redux README](https://github.com/aGuyNamedJonas/slim-redux#slim-redux) (very simple concept, I promise!)

```javascript
import React from 'react';
import { slimReduxReact } from 'slim-redux-react';

const TodoList = (props) => {
  return (
   <div>
     <ul>
       {props.todos.map(todo => <li key={todo.id}>{todo.text}</li>)}
     </ul>

     { /* props.addTodo is a change trigger function which takes the payload and dispatches an ADD_TODO action*/ }
     <button onClick={(e) => props.addTodo({id: 2, text: 'GET MILK!', checked: false})}>Add Todo</button>
   </div>
 );
}

export default slimReduxReact({
  component: TodoList,
  subscriptions: {
    todos: 'state.todos',
    other: 'state.anotherState',
  },
  changeTriggers: {
    // Notice how the button in the component uses props.addTodo
    addTodo: {
      // Action definition...
      actionType: 'ADD_TODO',
      // ...and reducer in one place OMG! Welcome to slim-redux, friend!
      // Hope you're digging this as much as I do :)
      reducer: (state, payload) => {
        return {
          ...state,
          todos: [
            ...state.todos,
            {id: payload.id, text: payload.text, checked: false}
          ]
        }
      }
    },
    someOtherChangeTrigger: {/* ... */},
  }
});
```  

Now this is not as complicated as it seems! Change triggers are a `slim-redux` concept that simply bundles actions and their reducers in one place.

**Read up on change triggers:** [slim-redux README](https://github.com/aGuyNamedJonas/slim-redux#slim-redux) (Very simple, you'll love it!) (hopefully :D  )  


## Bonus points: Make your slim-redux-react bindings even slimmer
To make the `slimReduxReact(/* ... */)` even slimmer, and more readable you can go ahead and define all related change triggers in one place:  

```javascript
// TodoChangeTriggers.js
export default TodoChangeTriggers = {
  addTodo: {
    actionType: 'ADD_TODO',
    reducer: /* ... */,
    payloadValidation: /* ... */,
  },

  deleteTodo: {
    actionType: 'DELETE_TODO',
    reducer: /* ... */,
    payloadValidation: /* ... */,
  }
}

// TodoList.js
import React from 'react';
import { slimReduxReact } from 'slim-redux-react';
import { addTodo, deleteTodo } from './TodoChangeTriggers'

const TodoList = (props) => { /* ... */ }

export default slimReduxReact({
  component: TodoList,
  subscriptions: { /* ... */ },
  changeTriggers: { addTodo, deleteTodo } // Slim ey? :)
});
```

____

# <a name="toc"></a>Table of Contents
* [Quick start](#quick-start)
* [Motivation](#motivation)
* [API Reference](#api-reference)
* [Recipes](#recipes)
  * [Async code & change triggers](#bundle-change-definitions)
* [Examples](#examples)
* [React Bindings](#react-bindings)
* [Future Development](#future-development)
* [Contribute](#contribute)
* [Feedback](#feedback)
* [License](#license)

____

## <a name="quick-start"></a>Quick Start  
