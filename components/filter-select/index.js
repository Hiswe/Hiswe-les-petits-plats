// https://stackoverflow.com/questions/55080103/how-to-separate-web-components-to-individual-files-and-load-them
// single file component alternative
// https://ckeditor.com/blog/implementing-single-file-web-components/

import { cleanText } from "/helpers.js";

const request = fetch(`/components/filter-select/template.html`)
  .then((stream) => stream.text())
  .then((text) => define(text));

export default request;

function define(html) {
  class FilterSelect extends HTMLElement {
    #data;
    #inputElement;
    #panelElement;

    constructor() {
      super();
      this.#render();
    }

    #render() {
      const shadow = this.attachShadow({ mode: `open` });
      let replacedHtml = html;
      [`label`, `placeholder`, `id`].forEach((key) => {
        replacedHtml = replacedHtml.replaceAll(
          `{{${key}}}`,
          this.getAttribute(key) || ``
        );
      });
      shadow.innerHTML = replacedHtml;
      this.#inputElement = this.shadowRoot.querySelector(`input`);
      this.#panelElement = this.shadowRoot.querySelector(`.panel`);
      this.#inputElement.addEventListener(`input`, () => this.#renderList());
      this.#inputElement.addEventListener(`focus`, () => {
        this.#showPanel();
      });

      this.#panelElement.addEventListener(`click`, (event) => {
        if (!event.target.matches(`button`)) return;
        event.stopPropagation();
        this.#closePanel();
        this.dispatchEvent(
          new CustomEvent(`selection`, {
            detail: event.target.dataset.keyword,
            bubbles: true,
            cancelable: true,
            composed: false,
          })
        );
      });

      // Listen for all clicks on the document
      document.addEventListener(`click`, (event) => {
        if (!event.target.closest(`filter-select`)) {
          return this.#closePanel();
        }
      });
    }

    #renderList() {
      if (!Array.isArray(this.#data)) {
        this.#panelElement.innerHTML = ``;
        return;
      }
      const value = cleanText(this.#inputElement.value);
      const filteredData = value
        ? this.#data.filter((item) => cleanText(item).includes(value))
        : this.#data;
      this.#panelElement.innerHTML = filteredData
        .map((item) => `<button data-keyword="${item}">${item}</button>`)
        .join(``);
    }

    #showPanel() {
      this.#inputElement.classList.add(`input--focus`);
      this.#panelElement.classList.add(`panel--show`);
    }

    #closePanel() {
      this.#inputElement.classList.remove(`input--focus`);
      this.#panelElement.classList.remove(`panel--show`);
    }

    get data() {
      return this.#data;
    }
    set data(newVal) {
      this.#data = newVal;
      this.#inputElement.value = ``;
      this.#renderList();
    }
  }

  customElements.define(`filter-select`, FilterSelect);
}
