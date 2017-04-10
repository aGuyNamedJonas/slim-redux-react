import React, { Component } from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { createSlimReduxStore } from 'slim-redux';
import logo from './logo.svg';
import './App.css';
import TodoList from './TodoList';

class App extends Component {
  constructor(props){
    super(props);

    this.store = createSlimReduxStore({
      todos: [
        {
          id: 0,
          text: 'Get milk',
          checked: false,
        }
      ],
      otherState: 'hello',
      anotherState: 'world',
    }, null, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

    const addTodo = this.store.createChangeTrigger({
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
        <Provider store={this.store}>
          <TodoList/>
        </Provider>
      </div>
    );
  }
}

export default App;
