import React, { Component } from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
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
      anotherState: 'world',
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
    this.store['TEST'] = 'HELLO STORE!'

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
        <Provider store={this.store}>
          <TodoList todos={todos}/>
        </Provider>
      </div>
    );
  }
}

export default App;
