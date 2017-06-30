import React from 'react';
import ReactDOM from 'react-dom';

import { createSlimReduxStore, connect, subscription, calculation, changeTrigger, asyncChangeTrigger, Provider } from 'slim-redux-react';

const store = createSlimReduxStore({ counter: 1, stuff: 'state' });


/*
    subscription(subscriptionString)
*/ 
const counter      = subscription('state.counter'),
      currentState = subscription('state');

/*
    changeTrigger(actionType, reducerFunction [, focusString])
*/
const inc = changeTrigger('INCREMENT_COUNTER', (value, counter) => counter + value, 'state.counter'),
      dec = changeTrigger('DECREMENT_COUNTER', (value, state) => ({ ...state, counter: state.counter - value }) );

/*
    asyncChangeTrigger(changeTriggers, changeTriggerFunction)
*/
const asyncInc = asyncChangeTrigger({ inc }, (value, ct) => {
    setTimeout(() => ct.inc(value), 2000);
});

/*
    calculation(subscriptions, calculationFunction)
*/
const counterPlus = calculation(['state.counter'], counter => counter + 5);


// Visual component
const Counter = ({ counter, inc, dec, asyncInc, counterPlus, currentState }) => (
    <div>
        <div>Counter (default): {counter}</div>
        <div>Counter (plus five): {counterPlus}</div>
        <div>
            <button onClick={e => inc(1)}>+</button>
            <button onClick={e => dec(1)}>-</button>
        </div>
        <div>
            <button onClick={e => asyncInc(5)}>Increase by 5 in 2 sec.</button>
        </div>
        <div>
            <div>Current State:</div>
            <div>{JSON.stringify(currentState, null, 2)}</div>
        </div>
    </div>
);


// Connect all the goodness to the visual react component, see how simple this is?
const CounterContainer = connect(Counter, { counter, inc, dec, asyncInc, counterPlus, currentState });


// Setup the store, just like you're used to from react-redux - with a <Provider/> component....
const App = () => (
    <Provider store={store}>
        <CounterContainer/>
    </Provider>
);


// Render it out....you know the drill :)
ReactDOM.render(<App />, document.getElementById('root'));
