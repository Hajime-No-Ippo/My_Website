import "@testing-library/jest-dom"

// Minimal IntersectionObserver mock for components that rely on it
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// @ts-ignore
global.IntersectionObserver = MockIntersectionObserver

// JSDOM lacks scrollTo on elements; provide a no-op to keep components happy in tests.
// @ts-ignore
if (!HTMLElement.prototype.scrollTo) {
  // @ts-ignore
  HTMLElement.prototype.scrollTo = () => {}
}
