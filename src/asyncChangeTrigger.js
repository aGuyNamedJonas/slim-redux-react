import { ASYNC_CHANGE_TRIGGER } from './constants';
import { asyncChangeTrigger as slimReduxAsyncChangeTrigger } from 'slim-redux';

export function asyncChangeTrigger(actionType, reducer, focusSubString) {
    const createAsyncChangeTrigger = () => slimReduxAsyncChangeTrigger(actionType, reducer, focusSubString);
    return {
        type            : ASYNC_CHANGE_TRIGGER,
        creatorFunction : createAsyncChangeTrigger, 
    };
}