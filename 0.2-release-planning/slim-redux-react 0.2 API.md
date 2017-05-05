# slim-redux-react 0.2 API
**Goals:**
 - Cleaner to use (replace argument objects with function parameters)
 - Safer to use (include argument checking in development)
 - Typed (include [flow typed lib defs](https://github.com/flowtype/flow-typed))

 ### connect(component, subscriptions, changeTriggers): containerComponent
 *(pka `slimReduxReact()`)*  

 **Description:** connects a visual react component to slim-redux and returns the containerized component.  

**Parameters:**
* `component`: The react component to be connected to slim-redux
* `subscriptions`: An object whose keys are the prop names that will be provided to the connected component which will contain the subscribed to state value. Keys can either be of the form `state.subkey.subkey` or can be computations
* `changeTriggers`: An object whose keys are the prop names that will be provided to the connected component which are the change trigger functions for the component to use. The change triggers passed in as the values of the object need to be either created with `changeTrigger()` or `asyncChangeTrigger()`

**Return:**  
The containerized react component that will get the subscriptions and change triggers provided as props.

**Example:**  
```javascript
<Insert example>
```


 **Reasons for change:**
 1. `Single object parameter --> Actual parameters`: Having to write out the actual object keys is the kind of overhead slim-redux-react is aiming to prevent. It's better readable, but only as long as people aren't used to using slim-redux-react. Providing function parameters, instead of a single object seems a lot cleaner and like a better way to design an API on top of that
 2. `slimReduxReact --> connect`: connect() is the function name that redux users are used to from react-redux. So we should use the same to not introduce yet another vocabulary. Also users will import connect from the slim-redux-react module, no reason why the name of the module should be used as the connect() function
