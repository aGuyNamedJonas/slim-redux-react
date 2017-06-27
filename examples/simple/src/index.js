import React from 'react';
import ReactDOM from 'react-dom';

import { connect, subscription, calculation, changeTrigger, asyncChangeTrigger, Provider } from 'slim-redux-react';
import { createSlimReduxStore } from 'slim-redux';

const store = createSlimReduxStore({ counter: 123 });

// stuff definitions
const counter = subscription('state.counter');

const Counter = ({ counter }) => (
    <div>Counter: {counter}</div>
);

const CounterContainer = connect(Counter, { counter: subscription('state.counter') });

const App = () => (
    <Provider store={store}>
        <CounterContainer/>
    </Provider>
);

ReactDOM.render(<App />, document.getElementById('root'));
