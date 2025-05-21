/**
 */
import charCodeGenerator from './util/charCodeGenerator.js';
import makeAsyncCharCodeIterator from './util/charCodeIterator.js';

const { KeyboardEvent } = window;

export function characterKeyShortcuts () {
  [...charCodeGenerator()].forEach(async (num) => {
    console.log(`>* ${num}: ${String.fromCharCode(num)}`);
    fireKBEvent('keydown', num);
    fireKBEvent('keypress', num);
    fireKBEvent('keyup', num);
    await delay(20);
  });
}

export async function characterKeyShortcutsIter () {
  const IT = makeAsyncCharCodeIterator();
  let RES = await IT.next();

  while (!RES.done) {
    console.log(`> ${RES.value}: ${String.fromCharCode(RES.value)}`);
    fireKBEvent('keydown', RES.value);
    fireKBEvent('keypress', RES.value);
    fireKBEvent('keyup', RES.value);
    RES = await IT.next();
  }
}

async function delay (delayMs) {
  return new Promise((resolve) => setTimeout(() => resolve(), delayMs));
}

export function fireKBEvent (evName, num) {
  const ev = new KeyboardEvent(evName, {
    key: String.fromCharCode(num),
    which: num,
    keyCode: num,
    charCode: num,
    bubbles: true,
    cancelable: false
  });
  document.body.dispatchEvent(ev);
  return ev;
}

function checkAndRun () {
  const SCRIPT = document.querySelector('script[src *= "characterKeyShortcuts.js"]');
  if (SCRIPT && SCRIPT.dataset.runBm) {
    characterKeyShortcuts();
  }
}

checkAndRun();

export default characterKeyShortcuts;
