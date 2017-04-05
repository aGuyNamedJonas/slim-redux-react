import React from 'react';
import slimReduxReact from './lib/slimReduxReact';

const TodoList = (props) => {
  return (
    <div>
      <ul>
        {props.todos.map(todo => <li key={todo.id}>{todo.text}</li>)}
      </ul>

      <button onClick={(e) => props.addTodo()}>Add Todo</button>
    </div>
  );
}

export default slimReduxReact({
  component: TodoList,
  changeTriggers: {
    addTodo: () => console.log('ADD_TODO change trigger called!')
  },
  subscriptions: {
    todos: 'state.todos',
    other: 'state.anotherStae',
  }
});
