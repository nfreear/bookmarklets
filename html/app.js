import 'ndf-elements';
import 'interestfor-polyfill'; // Doesn't work on shadow DOM :(.
// import 'invokers/interest';
import MyBookmarkletElement from '../lib/elements/MyBookmarkletElement.js';
export * from '../index.js';

window.customElements.define('my-bookmarklet', MyBookmarkletElement);

export function createBookmarklet (bookmarkletSource, cssSelector = 'my-bookmarklet') {
  const bookmarkletLinkElem = document.querySelector(cssSelector);

  console.assert(bookmarkletLinkElem, 'Missing my-bookmarklet element.');
  console.assert(typeof bookmarkletLinkElem.fromFunction === 'function', 'Missing fromFunction.');
  console.assert(typeof bookmarkletSource === 'function', 'Missing bookmarklet source.');

  bookmarkletLinkElem.fromFunction(bookmarkletSource);
}
