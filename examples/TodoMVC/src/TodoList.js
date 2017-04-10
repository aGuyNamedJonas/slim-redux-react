import React from 'react';
import { slimReduxReact } from 'slim-redux-react';

const TodoList = (props) => {
  return (
    <div>
      <ul>
        {props.todos.map(todo => <li key={todo.id}>{todo.text}</li>)}
      </ul>

      <button onClick={(e) => props.addTodo({todo: {id: 2, text: 'CUSTOM TODO!!!!', checked: false}})}>Add Todo</button>
    </div>
  );
}

export default slimReduxReact({
  component: TodoList,
  changeTriggers: {
    addTodo: {
      actionType: 'ADD_TODO',
      reducer: (state, payload) => {
        return {
          ...state,
          todos: [
            ...state.todos,
            payload.todo
          ]
        }
      }
    }
  },
  subscriptions: {
    todos: 'state.todos',
    other: 'state.anotherState',
  }
});
