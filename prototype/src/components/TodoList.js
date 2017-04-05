import { slimReduxReact } from '../lib/slimReduxReact'

export const TodoList = (props) => (
  <div>
    <Header addTodo={props.actions.addTodo} />
    <MainSection todos={props.todos} actions={props.actions} />
  </div>
)

export default slimReduxReact({
  component: App,
  subscriptions: {
    todos: 'store.todos',
  },
  changeTriggers: TodoChangeCreators
})
