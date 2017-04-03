import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Header from '../components/Header'
import MainSection from '../components/MainSection'
import * as TodoActions from '../actions'
import TodoChangeCreators from '../changes'
import { createSelector } from 'reselect'

// slim-redux: Remove actions from parameters!
class App extends React.Component {
  constructor(props) {
    super(props);

    const addTodo        = props.store.change(TodoChangeCreators.addTodo),
          deleteTodo     = props.store.change(TodoChangeCreators.deleteTodo),
          editTodo       = props.store.change(TodoChangeCreators.editTodo),
          completeTodo   = props.store.change(TodoChangeCreators.completeTodo),
          completeAll    = props.store.change(TodoChangeCreators.completeAll),
          clearCompleted = props.store.change(TodoChangeCreators.clearCompleted);

    this.actions = {
      addTodo,
      deleteTodo,
      editTodo,
      completeTodo,
      completeAll,
      clearCompleted,
    }

    this.getTodosFromStore = createSelector(
      [ state => state.todos ],
      todos => todos,
    )

    this.state = {
      todos: this.getTodosFromStore(props.store.getState())
    };

    // SUBSCRIBE THAT MOTHERFUCKER!!
  }

  render() {
    return (
      <div>
        <Header addTodo={this.actions.addTodo} />
        <MainSection todos={this.state.todos} actions={this.actions} />
      </div>
    )
  }
}

export default App
