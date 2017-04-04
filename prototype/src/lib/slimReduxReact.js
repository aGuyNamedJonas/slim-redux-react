import { createSelectorCreator } from 'reselect'

/*
  Prototyping the custom selector to notify us about updates
*/

function defaultEqualityCheck(a, b) {
  return a === b
}

export function areArgumentsShallowlyEqual(equalityCheck, prev, next) {
  if (prev === null || next === null || prev.length !== next.length) {
    return false
  }

  // Do this in a for loop (and not a `forEach` or an `every`) so we can determine equality as fast as possible.
  const length = prev.length
  for (let i = 0; i < length; i++) {
    if (!equalityCheck(prev[i], next[i])) {
      return false
    }
  }

  return true
}

function defaultMemoize(func, equalityCheck = defaultEqualityCheck, hasChanged) {
  let lastArgs = null
  let lastResult = null
  // we reference arguments instead of spreading them for performance reasons
  return function () {
    let changed = false

    if (!areArgumentsShallowlyEqual(equalityCheck, lastArgs, arguments)) {
      // apply arguments instead of spreading for performance.
      lastResult = func.apply(null, arguments)
      changed = true
    }

    lastArgs = arguments

    hasChanged(changed)
    return lastResult
  }
}

export const createNotifyingSelector = (hasChanged) => createSelectorCreator(
  defaultMemoize,
  undefined,
  hasChanged,
)
