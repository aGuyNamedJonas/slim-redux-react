import { CHANGE_TRIGGER } from './constants';
import { changeTrigger as slimReduxChangeTrigger } from 'slim-redux';

export function changeTrigger(actionType, reducer, focusSubString) {
    const createChangeTrigger = () => slimReduxChangeTrigger(actionType, reducer, focusSubString);
    return {
        type            : CHANGE_TRIGGER,
        creatorFunction : createChangeTrigger, 
    };
}