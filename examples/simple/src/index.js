import React from 'react';
import ReactDOM from 'react-dom';

import { connect, subscription, calculation, changeTrigger, asyncChangeTrigger, Provider } from 'slim-redux-react';
import { createSlimReduxStore, subscription as slimReduxSubscription } from 'slim-redux';

const store      = createSlimReduxStore({ counter: 1 }),
      counterLog = slimReduxSubscription('state.counter', counter => console.log(`New state.counter: ${counter}`));

// stuff definitions
const counter  = subscription('state.counter'),
      inc      = changeTrigger('INCREMENT_COUNTER', (value, counter) => counter + value, 'state.counter'),
      dec      = changeTrigger('DECREMENT_COUNTER', (value, counter) => counter - value, 'state.counter'),
      asyncInc = asyncChangeTrigger({ inc }, (value, ct) => {
          console.log(`value: ${value}`);
          console.log(`ct Object:`);
          console.dir(ct);
          console.log('Trying to call ct.inc():');
          ct.inc();
          setTimeout(() => ct.inc(value), 2000);
      });

const Counter = ({ counter, inc, dec, asyncInc }) => (
    <div>
        <div>Counter: {counter}</div>
        <div>
            <button onClick={e => inc(1)}>+</button>
            <button onClick={e => dec(1)}>-</button>
        </div>
        <div>
            <button onClick={e => asyncInc(5)}>Increase by 5 in 2 sec.</button>
        </div>
    </div>
);

const CounterContainer = connect(Counter, { counter, inc, dec, asyncInc });

const App = () => (
    <Provider store={store}>
        <CounterContainer/>
    </Provider>
);

ReactDOM.render(<App />, document.getElementById('root'));
