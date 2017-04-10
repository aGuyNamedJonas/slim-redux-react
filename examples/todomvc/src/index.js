import React from 'react'
import { render } from 'react-dom'
// import { createStore } from 'redux'
import { Provider } from 'react-redux'
import App from './containers/App'
import reducer from './reducers'
import 'todomvc-app-css/index.css'
import { createSlimReduxStore } from 'slim-redux'

// OLD: The redux store with the root reducer
// const store = createStore(reducer)

// NEW: Copy'n'pasted from reducers/todo.js and inserted into the state as the value for the property state.todos
const initialState = {
  todos: [
    {
      text: 'Use Redux',
      completed: false,
      id: 0
    }
  ]
}

// NEW: createSlimReduxStore() takes an initialState, an existing root reducer (or null) and in this case middleware that connects us to the redux-devtools browser extension
const store = createSlimReduxStore(initialState, reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
