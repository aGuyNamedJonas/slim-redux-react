import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Header from '../components/Header'
import MainSection from '../components/MainSection'
import * as TodoActions from '../actions'
import TodoChangeCreators from '../changes'
import { createSelector } from 'reselect'

// slim-redux: Remove actions from parameters!
// const App = ({todos, store, actions}) => {
const App = ({store, actions}) => {
  const addTodo        = store.change(TodoChangeCreators.addTodo),
        deleteTodo     = store.change(TodoChangeCreators.deleteTodo),
        editTodo       = store.change(TodoChangeCreators.editTodo),
        completeTodo   = store.change(TodoChangeCreators.completeTodo),
        completeAll    = store.change(TodoChangeCreators.completeAll),
        clearCompleted = store.change(TodoChangeCreators.clearCompleted);

  // slim-redux
  // const actions = {
  //   addTodo,
  //   deleteTodo,
  //   editTodo,
  //   completeTodo,
  //   completeAll,
  //   clearCompleted,
  // }

  const getTodosFromStore = createSelector(
    [ state => state.todos ],
    todos => todos,
  )

  var todos = getTodosFromStore(store.getState())

  return (
    <div>
      <Header addTodo={actions.addTodo} />
      <MainSection todos={todos} actions={actions} />
    </div>
  )
}

App.propTypes = {
  todos: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  todos: state.todos
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(TodoActions, dispatch)
})

/*
    Actions will be replaced by something like this:
    import * as todoChangeCreators from '../changes'

    const { addTodo, removeTodo, .... } = todoChangeCreators.map((changeCreator) => store.change({
      action: changeCreator.action,
      reducer: changeCreator.reducer,
      inputValidation: changeCreator.inputValidation,
    }))

*/

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
