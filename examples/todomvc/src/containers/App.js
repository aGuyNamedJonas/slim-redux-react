import React from 'react'
import PropTypes from 'prop-types'
import Header from '../components/Header'
import MainSection from '../components/MainSection'
import TodoChangeTriggerDefs from '../changeTriggers'
import { slimReduxReact } from 'slim-redux-react'

const App = ({todos, addTodo, deleteTodo, editTodo, completeTodo, completeAll, clearCompleted }) => {
  const actions = { addTodo, deleteTodo, editTodo, completeTodo, completeAll, clearCompleted }

  return (
    <div>
      <Header addTodo={addTodo} />
      <MainSection todos={todos} actions={actions} />
    </div>
  )
}

App.propTypes = {
  todos: PropTypes.array.isRequired,
}


export default slimReduxReact({
  component: App,
  subscriptions: { todos: 'state.todos' },
  changeTriggers: TodoChangeTriggerDefs,
})
