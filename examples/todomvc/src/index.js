import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './containers/App'
import 'todomvc-app-css/index.css'
import { createSlimReduxStore } from 'slim-redux'

const initialState = {
  todos: [
    {
      text: 'Use Redux',
      completed: false,
      id: 0
    }
  ]
}

const store = createSlimReduxStore(initialState, null, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
