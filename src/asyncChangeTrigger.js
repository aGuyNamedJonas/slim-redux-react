import { asyncChangeTrigger as slimReduxAsyncChangeTrigger } from 'slim-redux';

export function asyncChangeTrigger(actionType, reducer, focusSubString) {
    const createAsyncChangeTrigger = (actionType, reducer, focusSubString) => slimReduxChangeTrigger(actionType, reducer, focusSubString);
    return createAsyncChangeTrigger;
}