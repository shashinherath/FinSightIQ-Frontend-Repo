import "@testing-library/jest-dom";

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

type MatchMediaResult = {
  matches: boolean;
  media: string;
  onchange: null;
  addListener: () => void;
  removeListener: () => void;
  addEventListener: () => void;
  removeEventListener: () => void;
  dispatchEvent: () => boolean;
};

// jsdom does not provide ResizeObserver
Object.assign(globalThis, { ResizeObserver: ResizeObserverMock });

// lightweight-charts expects matchMedia in the test environment
if (!globalThis.matchMedia) {
  Object.assign(globalThis, {
    matchMedia: () =>
      ({
        matches: false,
        media: "",
        onchange: null,
        addListener() {},
        removeListener() {},
        addEventListener() {},
        removeEventListener() {},
        dispatchEvent() {
          return false;
        },
      }) as MatchMediaResult,
  });
}
