import '@testing-library/jest-dom'

Object.defineProperty(window.HTMLMediaElement.prototype, 'play', {
  writable: true,
  value: () => Promise.resolve(),
})

Object.defineProperty(window.HTMLMediaElement.prototype, 'pause', {
  writable: true,
  value: () => {},
})
