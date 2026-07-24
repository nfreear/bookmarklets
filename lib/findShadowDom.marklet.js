/**
 * Find Shadow DOMs.
 *
 * @see https://codepen.io/nfreear/pen/019f9570-a323-756d-a3e3-18e3dc72fe39
 */

/** The bookmarklet JavaScript, enclosed in an Immediately Invoked Function Expression (IIFE).
 * @see https://developer.mozilla.org/en-US/docs/Glossary/IIFE
 */
export function findShadowDomsBookmarklet () {
  (() => {
    const customEl = [];
    const shadowDoms = [];
    const output = document.createElement('output');
    function traverser (elem) {
      myWorker(elem);
      [...elem.children].forEach((el) => traverser(el));
    }
    function myWorker (el) {
      if (/\w+-\w+/.test(el.tagName)) {
        customEl.push({ tagName: el.tagName, el });
      }
      if (el.shadowRoot) {
        shadowDoms.push({ tagName: el.tagName, el });
      }
    }
    traverser(document.documentElement);
    console.debug('Shadow DOMs:', shadowDoms.length, shadowDoms);
    output.value = `Shadow DOMs: ${shadowDoms.length}`;
    output.style = 'border:2px solid; display:block; margin: 1rem;padding:1rem;';
    document.body.appendChild(output);
  })();
}

export default findShadowDomsBookmarklet;
