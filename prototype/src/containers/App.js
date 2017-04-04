import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Header from '../components/Header'
import MainSection from '../components/MainSection'
import * as TodoActions from '../actions'
import TodoChangeCreators from '../changes'
import { createNotifyingSelector, areArgumentsShallowlyEqual } from '../lib/slimReduxReact'
import isEqual from 'lodash.isequal'

// slim-redux: Remove actions from parameters!
class App extends React.Component {
  constructor(props) {
    super(props);
    this.store = props.store;
    this.shouldUpdate = false; // This defaults to false and is only changed through the subscibe() call

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

    this.getTodosFromStore = createNotifyingSelector(
      [ state => state.todos ],
      todos => todos,
    )

    this.state = {
      todos: this.getTodosFromStore(this.store.getState())
    };
  }

  componentDidMount() {
    // SUBSCRIBE THAT MOTHERFUCKER!!
    this.store.subscribe(() => this.setState({
      todos: this.getTodosFromStore(this.store.getState()),
    }))
  }

  shouldComponentUpdate(nextProps, nextState) {
    let update = false;

    // Step #1: Check whether the subscribed to values have changed
    update = update || this.shouldUpdate;

    // Step #2: Check whether state or props have changed
    // update = update || isEqual(this.props, nextProps) || isEqual(this.state, nextState);
    update = update || areArgumentsShallowlyEqual(this.equalityCheck, this.props, nextProps)
                    || areArgumentsShallowlyEqual(this.equalityCheck, this.state, nextState);

    return update;
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
