/**
 * Find Shadow DOMs / Find custom elements.
 *
 * @see https://codepen.io/nfreear/pen/019f9570-a323-756d-a3e3-18e3dc72fe39
 */

/** The bookmarklet JavaScript, enclosed in an Immediately Invoked Function Expression (IIFE).
 * @see https://developer.mozilla.org/en-US/docs/Glossary/IIFE
 */
export function findShadowDomsBookmarklet () {
  (async () => {
    const MOD = await import('{__ORIGIN__}/lib/BookmarkletTools.js');
    const shadowDoms = [];
    function traverser (elem) {
      myWorker(elem);
      [...elem.children].forEach((el) => traverser(el));
    }
    function myWorker (el) {
      if (el.shadowRoot) {
        shadowDoms.push({ tagName: el.tagName, el });
      }
    }
    traverser(document.documentElement);
    console.debug('Shadow DOMs:', shadowDoms.length, shadowDoms);
    MOD.createOutputElement(`Shadow DOMs: ${shadowDoms.length}`);
  })();
}

export function findCustomElementsBookmarklet () {
  (async () => {
    const MOD = await import('{__ORIGIN__}/lib/BookmarkletTools.js');
    const customEl = [];
    function traverser (elem) {
      myWorker(elem);
      [...elem.children].forEach((el) => traverser(el));
    }
    function myWorker (el) {
      if (/\w+-\w+/.test(el.tagName)) {
        customEl.push({ tagName: el.tagName, el });
      }
    }
    traverser(document.documentElement);
    console.debug('Custom elements:', customEl.length, customEl);
    MOD.createOutputElement(`Custom elements: ${customEl.length}`);
  })();
}

export default findShadowDomsBookmarklet;
