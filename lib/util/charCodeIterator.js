/**
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_generators
 * @see https://codepen.io/nfreear/pen/myyNyzy
 */
export const DEFAULTS = {
  start: 32,
  end: 8365,
  step: 1,
  timeout: 20 // Milliseconds.
};

export function makeAsyncCharCodeIterator (start = 32, end = 8365, step = 1, timeoutMs = 20) {
  let nextIndex = start;
  let iterationCount = 0;

  const myAsyncIterator = {
    async next () {
      let result;
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (nextIndex < end) {
            if (nextIndex === 127) { nextIndex = 161; }
            if (nextIndex === 192) { nextIndex = 8364; }

            result = { value: nextIndex, done: false };
            nextIndex += step;
            iterationCount++;
            return resolve(result);
          }
          return resolve({ value: iterationCount, done: true });
        },
        timeoutMs);
      });
    }
  };
  return myAsyncIterator;
}

export function makeCharCodeIterator (start = 32, end = 8365, step = 1) {
  let nextIndex = start;
  let iterationCount = 0;

  const myIterator = {
    async next () {
      let result;

      if (nextIndex < end) {
        if (nextIndex === 127) { nextIndex = 161; }
        if (nextIndex === 192) { nextIndex = 8364; }

        result = { value: nextIndex, done: false };
        nextIndex += step;
        iterationCount++;
        return result;
      }
      return { value: iterationCount, done: true };
    }
    /* [Symbol.iterator]() {
      return this;
    }, */
  };
  return myIterator;
}

export default makeAsyncCharCodeIterator;
