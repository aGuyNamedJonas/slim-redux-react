import { changeTrigger as slimReduxChangeTrigger } from 'slim-redux';

export function changeTrigger(actionType, reducer, focusSubString) {
    const createChangeTrigger = (actionType, reducer, focusSubString) => slimReduxChangeTrigger(actionType, reducer, focusSubString);
    return createChangeTrigger;
}