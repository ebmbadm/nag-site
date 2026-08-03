import "@testing-library/jest-dom";

class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (typeof IntersectionObserver === "undefined") {
  globalThis.IntersectionObserver = IntersectionObserverMock as unknown as typeof IntersectionObserver;
}

// jsdom does not implement HTMLDialogElement.showModal / close — polyfill them.
if (typeof HTMLDialogElement !== "undefined") {
  if (!HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.showModal = function () {
      this.setAttribute("open", "");
    };
  }
  if (!HTMLDialogElement.prototype.close) {
    HTMLDialogElement.prototype.close = function () {
      this.removeAttribute("open");
    };
  }
}
