import React from 'react';
import { connect, Provider } from '../';
import { shallow } from 'enzyme';
import { changeTrigger as slimReduxChangeTrigger, createSlimReduxStore } from 'slim-redux';

const store      = createSlimReduxStore({ one: 'one', two: 'two', three: { four: 'four' } }),
      resetStore = slimReduxChangeTrigger('RESET_STORE', state => ({ one: 'one', two: 'two', three: { four: 'four' } }));

const BasicComponent = (props) => (
  <div>Basic Component</div>
);

beforeEach(() => resetStore());

describe('connect() (default behavior)', () => {
  test('returns a react component', () => {
    const ConnectedBasicComponent = connect(BasicComponent), 
          wrapper = shallow(
            <Provider store={store}>
              <ConnectedBasicComponent/>
            </Provider>
          );

    expect(wrapper).toMatchSnapshot();
  });

  test('makes subscription() and calculation() values available to connected component through props', () => {
    expect(true).toBe(false);
  });

  test('re-render when subscription changes', () => {
    expect(true).toBe(false);
  });

  test('does not re-render when non-subscribed to part of the state changes', () => {
    expect(true).toBe(false);
  });

  test('re-renders when calculation changes', () => {
    expect(true).toBe(false);
  });

  test('does not re-render when a part of the state changes that the calculation is not subscribed to', () => {
    expect(true).toBe(false);
  });

  test('makes change triggers available to component through props', () => {
    expect(true).toBe(false);
  });

  test('makes async change triggers available to component through props', () => {
    expect(true).toBe(false);
  });

  test('subscriptions, calculations, change triggers and async change triggers use the store instance provided through the <Provider/> component', () => {
    expect(true).toBe(false);
  });
});
