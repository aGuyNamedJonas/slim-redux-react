import React from 'react';
import renderer from 'react-test-renderer';
import { createSlimReduxStore } from 'slim-redux';
import slimReduxReact from '../slimReduxReact';
import { Provider } from '../index';
import { mount } from 'enzyme';
import sinon from 'sinon';

const INITIAL_COUNTER_STATE     = 0,
      INCREMENTED_COUNTER_STATE = 1,
      INCREMENT                 = 'INCREMENT';

class Counter extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div>
        <h1>{this.props.counter}</h1>
        <button onClick={e => this.props.increaseCounter()}>INCREASE COUNTER</button>
      </div>
    );
  }
}

const increaseCounterChangeTrigger = {
  actionType: 'INCREASE',
  reducer: state => ({ ...state, counter: state.counter + 1 }),
};

test('Provider is exported by slim-redux-react module', () => {
  expect(Provider).toBeDefined();
})

test('slimReduxReact() renders correctly', () => {
  const store = createSlimReduxStore({counter: INITIAL_COUNTER_STATE});
  const CounterContainer = slimReduxReact({
    component: Counter,
    subscriptions: { counter: 'state.counter' },
    changeTriggers: { increaseCounter: increaseCounterChangeTrigger }
  });

  const App = (
    <div>
      <Provider store={store}>
        <CounterContainer/>
      </Provider>
    </div>
  );

  const component = renderer.create(App);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot('full');
});

test('HOC renders even when no subscriptions are provided', () => {
  const store = createSlimReduxStore({counter: INITIAL_COUNTER_STATE});
  const CounterContainer = slimReduxReact({
    component: Counter,
    changeTriggers: { increaseCounter: increaseCounterChangeTrigger }
  });

  const App = (
    <div>
      <Provider store={store}>
        <CounterContainer/>
      </Provider>
    </div>
  );

  const component = renderer.create(App);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot('no-subscriptions');
});

test('HOC renders even when no change triggers are provided', () => {
  const store = createSlimReduxStore({counter: INITIAL_COUNTER_STATE});
  const CounterContainer = slimReduxReact({
    component: Counter,
    subscriptions: { counter: 'state.counter' },
  });

  const App = (
    <div>
      <Provider store={store}>
        <CounterContainer/>
      </Provider>
    </div>
  );

  const component = renderer.create(App);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot('no-change-triggers');
});

test('Wrapped component correctly receives subscribed-to data', () => {
  const store = createSlimReduxStore({counter: INITIAL_COUNTER_STATE});
  const increaseCounter = store.createChangeTrigger(increaseCounterChangeTrigger);
  const CounterContainer = slimReduxReact({
    component: Counter,
    subscriptions: { counter: 'state.counter' },
    changeTriggers: { increaseCounter: increaseCounterChangeTrigger }
  });

  const wrapper = mount(
    <div>
      <Provider store={store}>
        <CounterContainer/>
      </Provider>
    </div>
  );

  // Check what the initial counter state is inside the counter component
  const initialSubscriptionValue = wrapper.find(Counter).prop('counter');
  // Increase counter
  increaseCounter();
  // check subscribed to counter prop inside counter component
  const increaseSubscriptionValue = wrapper.find(Counter).prop('counter');

  expect(initialSubscriptionValue).toEqual(INITIAL_COUNTER_STATE);
  expect(increaseSubscriptionValue).toEqual(INCREMENTED_COUNTER_STATE);
});

test('Wrapped component re-renders on subscription change ', () => {
  const CounterComponent = Counter;
  const onRender = sinon.spy(CounterComponent.prototype, 'render');

  const store = createSlimReduxStore({
    counter: 0,
    somethingElse: 'test',
  });

  const increaseCounter = store.createChangeTrigger({
    actionType: 'INCREMENT',
    reducer: state => ({...state, counter: store.counter + 1 }),
  });

  const CounterSubscribed = slimReduxReact({
    component: CounterComponent,
    subscriptions: { counter: 'state.counter' }
  });

  const wrapper = mount(
    <div>
      <Provider store={store}>
        <CounterSubscribed/>
      </Provider>
    </div>
  );

  // Save initial render count
  const initialRenderCount = onRender.callCount;

  // Modify subscribed-to state and save call count
  increaseCounter();
  const shouldIncreaseRenderCount = onRender.callCount;

  expect(shouldIncreaseRenderCount).toEqual(initialRenderCount + 1);

  // Cleanup the sinon spy
  onRender.restore();
});

test('Wrapped component does not re-render on change of non-subscribed to data', () => {
  const CounterComponent = Counter;
  const onRender = sinon.spy(CounterComponent.prototype, 'render');

  const store = createSlimReduxStore({
    counter: 0,
    somethingElse: 'test',
  });

  const modifySomethingElse = store.createChangeTrigger({
    actionType: 'MODIFY_SOME_OTHER_PART_OF_THE_STATE',
    reducer: state => ({...state, somethingElse: store.somethingElse + '.' }),
  });

  const CounterSubscribed = slimReduxReact({
    component: CounterComponent,
    subscriptions: { counter: 'state.counter' }
  });

  const wrapper = mount(
    <div>
      <Provider store={store}>
        <CounterSubscribed/>
      </Provider>
    </div>
  );

  // Save initial render count
  const initialRenderCount = onRender.callCount;

  // Modify non-subscribed to state and save call count
  modifySomethingElse();
  const shouldNotChangeRenderCount = onRender.callCount;

  expect(shouldNotChangeRenderCount).toEqual(initialRenderCount);

  // Cleanup the sinon spy
  onRender.restore();
});

test('Change trigger called inside of wrapped component works', () => {
  const CounterComponent = Counter;

  const store = createSlimReduxStore({
    counter: 0,
    somethingElse: 'test',
  });

  const increaseCounter = {
    actionType: 'INCREMENT',
    reducer: state => ({...state, counter: state.counter + 1 }),
  };

  const CounterContainer = slimReduxReact({
    component: CounterComponent,
    subscriptions: { counter: 'state.counter' },
    changeTriggers: { increaseCounter }
  });

  const wrapper = mount(
    <div>
      <Provider store={store}>
        <CounterContainer/>
      </Provider>
    </div>
  );

  // Save initial render count
  wrapper.find('button').simulate('click');
  expect(store.getState().counter).toEqual(1);
});
