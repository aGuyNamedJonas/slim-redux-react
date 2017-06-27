import { ASYNC_CHANGE_TRIGGER } from './constants';
import { asyncChangeTrigger as slimReduxAsyncChangeTrigger } from 'slim-redux';

export function asyncChangeTrigger(changeTriggers, triggerFunction) {
    const createAsyncChangeTrigger = () => slimReduxAsyncChangeTrigger(changeTriggers, triggerFunction);
    return {
        type            : ASYNC_CHANGE_TRIGGER,
        creatorFunction : createAsyncChangeTrigger, 
    };
}