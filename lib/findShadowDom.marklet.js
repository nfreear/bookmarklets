const { NodeFilter } = window;

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
    const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_ELEMENT);
    while (walker.nextNode()) {
      const el = walker.currentNode;
      if (el.shadowRoot) { shadowDoms.push({ tagName: el.tagName, el }); }
    }
    MOD.createOutputElement(`Shadow DOMs: ${shadowDoms.length}`, shadowDoms);
  })();
}

export function findCustomElementsBookmarklet () {
  (async () => {
    const MOD = await import('{__ORIGIN__}/lib/BookmarkletTools.js');
    const customEl = [];
    const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_ELEMENT);
    while (walker.nextNode()) {
      const el = walker.currentNode;
      if (/\w+-\w+/.test(el.tagName)) { customEl.push({ tagName: el.tagName, el }); }
    }
    MOD.createOutputElement(`Custom elements: ${customEl.length}`, customEl);
  })();
}

export default findShadowDomsBookmarklet;
