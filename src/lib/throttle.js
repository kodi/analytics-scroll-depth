export default function throttle(fcn, threshhold) {
  let last    = 0
  let timeout = null

  return (...args) => {
    const time = new Date().getTime()
    if (time < last + threshhold) {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        last = time
        fcn.apply(this, args)
      }, threshhold)
    } else {
      last = time
      fcn.apply(this, args)
    }
  }
}
