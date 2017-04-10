slim-redux-react
================
README IS WIP! Updates will follow shortly!

[*Jump to Table of Contents*](#toc)  
Official react bindings for [slim-redux](https://github.com/aGuyNamedJonas/slim-redux) which provides components access to the store through `subscriptions` and lets them modify the state through `change triggers`.

`slim-redux-react` uses [reselect](https://github.com/reactjs/reselect) for implementing subscriptions efficiently and `slim-redux` [change triggers](https://github.com/aGuyNamedJonas/slim-redux#step-1-create-a-change-trigger) to make store changes a (boilerplate reduced) breeze.

____

# <a name="toc"></a>Table of Contents
* [Quick start](#quick-start)
* [Motivation](#motivation)
* [API Reference](#api-reference)
* [Recipes](#recipes)
  * [Async code & change triggers](#bundle-change-definitions)
  * [Simple vs. complex container components](#heavy-light-container-components)
  * [Using slim-react-redux in existing react-redux apps](#integrating-into-existing-apps)
* [Examples](#examples)
* [Future Development](#future-development)
* [Contribute](#contribute)
* [Feedback](#feedback)
* [License](#license)

____

## <a name="quick-start"></a>Quick Start  
