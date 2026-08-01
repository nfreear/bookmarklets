const { customElements, HTMLElement } = globalThis;

export class BookmarkletOutputElement extends HTMLElement {
  #output;
  set value (data) { this.#output.value = data; }
  get value () { return this.#output.value; }

  constructor () {
    super();

    const root = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    this.#output = document.createElement('output');

    root.appendChild(style);
    root.appendChild(this.#output);

    style.textContent = `
    output {
      background-color: #fcfcfc;
      border: 2px solid currentColor;
      border-radius: .2rem;
      color: #222;
      display: block;
      padding: 1rem;
      position: fixed;
      bottom: 0;
      left: 0;
    }
`;
  }
}

export function createOutputElement (value = null, tagName = 'bookmarklet-output') {
  customElements.define(tagName, BookmarkletOutputElement);
  const ELEM = document.createElement(tagName);
  document.body.appendChild(ELEM);
  if (value) {
    ELEM.value = value;
  }
  return ELEM;
}
