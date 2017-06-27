export const error = (location, msg) => {
  throw new Error(`*** Error in ${location}: ${msg}`)
}

export const getType = whatever => (whatever).constructor;
export const isObject = obj => (obj).constructor === Object;