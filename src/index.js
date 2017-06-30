import { connect } from './connect';
import { Provider } from 'react-redux';
import { subscription } from './subscription';
import { calculation } from './calculation';
import { changeTrigger } from './changeTrigger';
import { asyncChangeTrigger } from './asyncChangeTrigger';
import { createSlimReduxStore } from 'slim-redux';

export {
  connect,
  Provider,
  subscription,
  calculation,
  changeTrigger,
  asyncChangeTrigger,
  createSlimReduxStore,
}
