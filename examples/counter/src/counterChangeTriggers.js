export default {
  increaseCounter: {
    actionType: 'INCREMENT',
    reducer: (state) => {
      return state + 1;
    }
  },
  decreaseCounter: {
    actionType: 'DECREMENT',
    reducer: (state) => {
      return state - 1;
    }
  }
};
