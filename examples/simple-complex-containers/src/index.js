import React from 'react';
import ReactDOM from 'react-dom';
import SimpleCounterContainer from './SimpleCounter';
import ComplexCounterContainer from './ComplexCounterContainer';
import { createSlimReduxStore, Provider } from 'slim-redux';

// Create the store, give it an initial state of 0 (and make redux store visible in redux-devtools browser extension)
const store = createSlimReduxStore(0, null, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

ReactDOM.render(
  <div>
    <Provider store={store}>
      <div>
        <SimpleCounterContainer/>
        <ComplexCounterContainer/>
      </div>
    </Provider>
  </div> ,
  document.getElementById('root')
);
