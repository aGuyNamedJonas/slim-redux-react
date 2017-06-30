import { error as _err, getType, isFunction, isSet, isObject } from './util';
import { ASYNC_CHANGE_TRIGGER, CHANGE_TRIGGER, SLIM_REDUX_COMP_NOTICE } from './constants';
import { asyncChangeTrigger as slimReduxAsyncChangeTrigger } from 'slim-redux';

const error = msg => _err(`slim-redux-react asyncChangeTrigger()`, msg);

export function asyncChangeTrigger(changeTriggers, triggerFunction) {
    // Parameter validation
    if(!isSet(changeTriggers))
        error(`"changeTrigger" (first argument) cannot be null or undefined: \n ${JSON.stringify(arguments, null, 2)}`);    

    if(!isObject(changeTriggers))
        error(`"changeTriggers" (first argument) needs to be an object, got ${getType(changeTriggers)} instead: \n ${JSON.stringify(arguments, null, 2)}`);

    if(!isSet(triggerFunction))
        error(`"triggerFunction" (second argument) cannot be null or undefined: \n ${JSON.stringify(arguments, null, 2)}`);
    
    if(!isFunction(triggerFunction))
        error(`"triggerFunction" (second argument) needs to be a function, got ${getType(triggerFunction)} instead: \n ${JSON.stringify(arguments, null, 2)}`);

    // Unpack change triggers (to get to the change triggers slim-redux can use)
    const changeTriggersInitialized = {};

    Object.keys(changeTriggers).map(key => {
        if(changeTriggers[key].type === CHANGE_TRIGGER)
            changeTriggersInitialized[key] = changeTriggers[key].creatorFunction();
        else
            error(`Issue with changeTriggers[${key}]: Does not seem to be a changeTrigger created with the slim-redux-react API. ${SLIM_REDUX_COMP_NOTICE} \n ${JSON.stringify(arguments, null, 2)}`);
    });

    console.log('Initialized change triggers in asyncChangeTrigger (slim-redux-react):');
    console.dir(changeTriggersInitialized);

    const createAsyncChangeTrigger = () => slimReduxAsyncChangeTrigger(changeTriggersInitialized, triggerFunction);
    return {
        type            : ASYNC_CHANGE_TRIGGER,
        creatorFunction : createAsyncChangeTrigger, 
    };
}