import React, { Component } from 'react';
import { createStore, Provider } from 'redux';
import { createSlimReduxReducer, initSlimRedux } from 'slim-redux';
import logo from './logo.svg';
import './App.css';
import TodoList from './TodoList';

class App extends Component {
  constructor(props){
    super(props);

    this.store = createStore(createSlimReduxReducer({
      todos: [
        {
          id: 0,
          text: 'Get milk',
          checked: false,
        }
      ],
      otherState: 'hello',
    }));

    initSlimRedux(this.store);

    const addTodo = this.store.change({
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
    })

    this.store.subscribe(() => console.log(`Current store: \n ${JSON.stringify(this.store.getState(), null, 2)}`));

    addTodo({
      todo: {
        id: 1,
        text: 'Another todo',
        checked: false,
      }
    })
  }

  render() {
    const todos = this.store.getState().todos;

    return (
      <div>
        <TodoList todos={todos}/>
      </div>
    );
  }
}

export default App;
