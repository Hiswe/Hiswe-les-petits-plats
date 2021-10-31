// https://stackoverflow.com/questions/55080103/how-to-separate-web-components-to-individual-files-and-load-them
// single file component alternative
// https://ckeditor.com/blog/implementing-single-file-web-components/

const request = fetch(`/components/search-bar/template.html`)
  .then((stream) => stream.text())
  .then((text) => define(text));

export default request;

function define(html) {
  class SearchBar extends HTMLElement {
    #inputElement;

    constructor() {
      super();
      this.#render();
    }

    #render() {
      const shadow = this.attachShadow({ mode: `open` });
      shadow.innerHTML = html;
      this.#inputElement = this.shadowRoot.querySelector(`input`);
    }

    connectedCallback() {
      this.#inputElement.addEventListener(`input`, (e) => {
        // re-emit the event
        this.dispatchEvent(new e.constructor(e.type, e));
      });
    }

    get value() {
      return this.#inputElement.value;
    }
  }

  customElements.define(`search-bar`, SearchBar);
}
