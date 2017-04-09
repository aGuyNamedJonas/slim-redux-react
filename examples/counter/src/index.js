import React from 'react';
import ReactDOM from 'react-dom';
import CounterContainer from './Counter';
import { createSlimReduxStore } from 'slim-redux';
import { Provider } from 'react-redux';

// Create the store, give it an initial state of 0 (and make redux store visible in redux-devtools browser extension)
const store = createSlimReduxStore(0, null, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

ReactDOM.render(
  <div>
    <Provider store={store}>
      <CounterContainer/>
    </Provider>
  </div>  ,
  document.getElementById('root')
);
