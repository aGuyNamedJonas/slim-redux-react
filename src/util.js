export const error = (location, msg) => {
  throw new Error(`*** Error in ${location}: ${msg}`)
}