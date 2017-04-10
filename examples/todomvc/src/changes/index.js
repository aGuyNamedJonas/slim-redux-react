const TodoChangeCreators = {
  addTodo: {
    actionType: 'ADD_TODO',
    reducer: (state,payload) => ({
      ...state,
      todos: [
        {
          id: state.todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
          completed: false,
          text: payload.text
        },
        ...state.todos
      ],
    }),
    payloadValidation: null,
  },

  deleteTodo: {
    actionType: 'DELETE_TODO',
    reducer: (state,payload) => ({
      ...state,
      todos: state.todos.filter(todo =>
        todo.id !== payload.id
      )
    }),
    payloadValidation: null,
  },

  editTodo: {
    actionType: 'EDIT_TODO',
    reducer: (state,payload) => ({
      ...state,
      todos: state.todos.map(todo =>
        todo.id === payload.id ?
          { ...todo, text: payload.text } :
          todo
      )
    }),
    payloadValidation: null,
  },

  completeTodo: {
    actionType: 'COMPLETE_TODO',
    reducer: (state,payload) => ({
      ...state,
      todos: state.todos.map(todo =>
        todo.id === payload.id ?
          { ...todo, completed: !todo.completed } :
          todo
      )
    }),
    payloadValidation: null,
  },

  completeAll: {
    actionType: 'COMPLETE_ALL',
    reducer: (state,payload) => {
      const areAllMarked = state.todos.every(todo => todo.completed)
      return state.todos.map(todo => ({
        ...todo,
        completed: !areAllMarked
      }))
    },
    payloadValidation: null,
  },

  clearCompleted: {
    actionType: 'CLEAR_COMPLETED',
    reducer: (state,payload) => ({
      ...state,
      todos: state.todos.filter(todo => todo.completed === false)
    }),
    payloadValidation: null,
  },
};

export default TodoChangeCreators;
