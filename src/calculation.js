import { calculation as slimReduxCalculation } from 'slim-redux';

export function calculation(subscriptions, calcFunction) {
    const createCalculation = (changeCallback, storeArg) => slimReduxCalculation(subscriptions, calcFunction, changeCallback, storeArg);
    return createCalculation;
}