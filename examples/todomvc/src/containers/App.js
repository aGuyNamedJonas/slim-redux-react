import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Header from '../components/Header'
import MainSection from '../components/MainSection'
import TodoChangeCreators from '../changes'
import { getNotifyingSelectorCreator, areArgumentsShallowlyEqual } from '../lib/selector'
import isEqual from 'lodash.isequal'
import { slimReduxReact } from '../lib/slimReduxReact'

const App = (props) => (
  <div>
    <Header addTodo={props.actions.addTodo} />
    <MainSection todos={props.todos} actions={props.actions} />
  </div>
)

/* THIS CODE WORKS! (just remove the _Prototype from the name) */
class AppContainer extends React.Component {
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

    const createNotifyingSelector = getNotifyingSelectorCreator()

    this.checkSubscriptionSelector = createNotifyingSelector(
      [ state => state.todos ],
      todos => ({todos: todos}),
    )

    const initialSubscriptionState = this.checkSubscriptionSelector(this.store.getState())

    this.state = {
      ...initialSubscriptionState.data,
      shouldUpdate: true,
    }
  }

  componentDidMount() {
    // SUBSCRIBE THAT MOTHERFUCKER!!
    this.store.subscribe(() => {
      const subscriptionState = this.checkSubscriptionSelector(this.store.getState())

      if(subscriptionState.hasChanged)
        this.setState({
          ...this.state,
          shouldUpdate: subscriptionState.hasChanged,
          ...subscriptionState.data,
      })
    })
  }

  // This gets triggered by state changes, so we can be sure to hit this check
  // once we set a new state in the createNotifyingSelector call
  shouldComponentUpdate(nextProps, nextState) {
    console.log(`Calling shouldComponentUpdate with nextState.shouldUpdate: ${nextState.shouldUpdate}`)
    console.log(`nextState: ${JSON.stringify(nextState, null, 2)}`)

    let update = false;

    // Step #1: Check whether the subscribed to values have changed
    update = update || nextState.shouldUpdate;

    // Step #2: Check whether props have changed
    update = update || areArgumentsShallowlyEqual(this.equalityCheck, this.props, nextProps)

    // If shouldUpdate was set to true, reset it
    if(nextState.shouldUpdate)
      nextState.shouldUpdate = false

    console.log(`should this update? ${update}`)
    return update;
  }

  render() {
    console.log(`Current state: ${JSON.stringify(this.state, null, 2)}`)
    const wrapperProps = {
      ...this.props,
      todos: this.state.todos,
      actions: this.actions,
    }

    return (
      <App {...wrapperProps}/>
    )
  }
}

export default AppContainer
