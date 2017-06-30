import React from 'react';
import ReactDOM from 'react-dom';

import { connect, subscription, calculation, changeTrigger, asyncChangeTrigger, Provider } from 'slim-redux-react';
import { createSlimReduxStore, subscription as slimReduxSubscription } from 'slim-redux';

const store      = createSlimReduxStore({ counter: 1, stuff: 'state' }),
      stateLog   = slimReduxSubscription('state', state => console.log(`New state.counter: ${JSON.stringify(state, null, 2)}`));

// stuff definitions
const counter      = subscription('state.counter'),
      inc          = changeTrigger('INCREMENT_COUNTER', (value, counter) => counter + value, 'state.counter'),
      dec          = changeTrigger('DECREMENT_COUNTER', (value, counter) => counter - value, 'state.counter'),
      asyncInc     = asyncChangeTrigger({ inc }, (value, ct) => {
          setTimeout(() => ct.inc(value), 2000);
      }),
      counterPlus  = calculation(['state.counter'], counter => counter + 5);

const Counter = ({ counter, inc, dec, asyncInc, counterPlus }) => (
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
    </div>
);

const CounterContainer = connect(Counter, { counter, inc, dec, asyncInc, counterPlus });

const App = () => (
    <Provider store={store}>
        <CounterContainer/>
    </Provider>
);

ReactDOM.render(<App />, document.getElementById('root'));
