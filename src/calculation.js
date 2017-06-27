import { CALCULATION } from './constants';
import { calculation as slimReduxCalculation } from 'slim-redux';

export function calculation(subscriptions, calcFunction) {
    const createCalculation = (changeCallback, storeArg) => slimReduxCalculation(subscriptions, calcFunction, changeCallback, storeArg);
    return {
        type            : CALCULATION,
        creatorFunction : createCalculation, 
    };
}