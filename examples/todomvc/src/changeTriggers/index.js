/*
    New: Change trigger definitions.

    To have these in a file like this makes sens for importing.
    Notice how the reducer code had to be slightly modified:
    In react-redux the reducers only take care of one part of the state tree (in this case: todos),
    but in slim-redux-react the reducers are defined for the complete state.
*/

export default {
  addTodo: {
    actionType: 'ADD_TODO'
    reducer: (state, payload) => ({
      ...state,
      todos: [
        {
          id: state.todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
          completed: false,
          text: payload.text
        },
        ...state.todos,
      ],
    })
  },
  deleteTodo: {
    actionType: 'DELETE_TODO'
    reducer: (state, payload) => ({
      ...state,
      todos: state.todos.filter(todo =>
        todo.id !== payload.id
      ),
    })
  },
  editTodo: {
    actionType: 'EDIT_TODO'
    reducer: (state, payload) => ({
      ...state,
      todos: state.todos.map(todo =>
        todo.id === payload.id ?
          { ...todo, text: payload.text } :
          todo
      ),
    })
  },
  completeTodo: {
    actionType: 'COMPLETE_TODO'
    reducer: (state, payload) => ({
      ...state,
      todos: state.todos.map(todo =>
        todo.id === payload.id ?
          { ...todo, completed: !todo.completed } :
          todo
      ),
    })
  },
  completeAll: {
    actionType: 'COMPLETE_ALL'
    reducer: (state, payload) => {
      const areAllMarked = state.todos.every(todo => todo.completed)
      return ({
        ...state,
        todos: state.todos.map(todo => ({
          ...todo,
          completed: !areAllMarked
        })),
      })
    }
  },
  clearCompleted: {
    actionType: 'CLEAR_COMPLETED'
    reducer: (state, payload) => ({
      ...state,
      todos: state.todos.filter(todo => todo.completed === false),
    })
  },
}
