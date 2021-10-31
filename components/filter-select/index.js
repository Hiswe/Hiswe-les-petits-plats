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
      [`label`, `placeholder`].forEach((key) => {
        replacedHtml = replacedHtml.replace(
          `{{${key}}}`,
          this.getAttribute(key) || ``
        );
      });
      shadow.innerHTML = replacedHtml;
      this.#inputElement = this.shadowRoot.querySelector(`input`);
      this.#panelElement = this.shadowRoot.querySelector(`.panel`);
      this.#inputElement.addEventListener(`input`, () => this.#renderList());
    }

    #renderList() {
      if (!Array.isArray(this.#data)) {
        this.#panelElement.innerHTML = ``;
        return;
      }
      const value = cleanText(this.#inputElement.value);
      console.log({ value });
      const filteredData = value
        ? this.#data.filter((item) => cleanText(item).includes(value))
        : this.#data;
      this.#panelElement.innerHTML = filteredData
        .map((item) => `<button data-item="${item}">${item}</button>`)
        .join(``);
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
