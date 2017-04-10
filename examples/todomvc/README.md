# slim-redux-react TodoMVC Example
This classic TodoMVC example is both the mandatory MVC example for every project and a demonstration of how you can refactor existing react-redux apps.  

But of course you can also just take a look at the final result:

Install: `npm install`  
Run: `npm start`  

This example copy'n'pasted from the [react-redux repo](https://github.com/reactjs/redux/tree/master/examples/todomvc) and was originally created using [Create React App](https://github.com/facebookincubator/create-react-app) (which is downright awesome!)

## Refactoring react-redux app 🢂 slim-redux-react
These are the steps I took in order to refactor this react-redux based app to completely rely on slim-redux-react (the links point to commits):  

[Step #1: Install slim-redux, slim-redux-react and replace redux store with react-redux-store](https://github.com/aGuyNamedJonas/slim-redux-react/commit/b7e9f86394d78a75716a62da5a9204f02c1ee906)  

[Step #2: Use existing action types and reducers to create change trigger definitions](https://github.com/aGuyNamedJonas/slim-redux-react/commit/f1ba9e9a863f82835fd1fa01af8f5f58b0755e18)  

[Step #3: Replace mapStateToProps with slim-redux-react subscriptions](https://github.com/aGuyNamedJonas/slim-redux-react/commit/d3776943ed6718a280678bbde64d426fa78158fd) and [this](https://github.com/aGuyNamedJonas/slim-redux-react/commit/d3776943ed6718a280678bbde64d426fa78158fd)

[Step #4: Remove old rootreducer, add change triggers to slimReduxReact and make sure that addTodo is called with the parameters as an object](https://github.com/aGuyNamedJonas/slim-redux-react/commit/da3348fc1cfcd1b783718ac2923671005de31555)

[Step #5: Some refactoring to make sure all change triggers are called with an object as the argument](https://github.com/aGuyNamedJonas/slim-redux-react/commit/178bf67afc8f78d83ffa5942184bb4831242ac9f)  

[Step #6: Look at all the files we don't need anymore!](https://github.com/aGuyNamedJonas/slim-redux-react/commit/1d233d349f8709c6a46a3afd6f6133448dba78ea)
