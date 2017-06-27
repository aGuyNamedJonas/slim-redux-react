import { SUBSCRIPTION } from './constants';
import { subscription as slimReduxSubscription } from 'slim-redux';

export function subscription(subscription) {
    const createSubscription = (changeCallback, storeArg) => slimReduxSubscription(subscription, changeCallback, storeArg);
    return {
        type            : SUBSCRIPTION,
        creatorFunction : createSubscription, 
    };
}