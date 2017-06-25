import { subscription as slimReduxSubscription } from 'slim-redux';

export function subscription(subscription) {
    const createSubscription = (changeCallback, storeArg) => slimReduxSubscription(subscription, changeCallback, storeArg);
    return createSubscription;
}