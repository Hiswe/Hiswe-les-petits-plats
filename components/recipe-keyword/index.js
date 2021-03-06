// https://stackoverflow.com/questions/55080103/how-to-separate-web-components-to-individual-files-and-load-them
// single file component alternative
// https://ckeditor.com/blog/implementing-single-file-web-components/

const request = fetch(`/components/recipe-keyword/template.html`)
  .then((stream) => stream.text())
  .then((text) => define(text));

export default request;

function define(html) {
  class RecipeKeyword extends HTMLElement {
    #shadow;
    constructor() {
      super();
      this.#shadow = this.attachShadow({ mode: `open` })
      this.#render();

    }

    static get observedAttributes() {
      return [`label`];
    }

    #render() {
      let replacedHtml = html;
      [`label`].forEach((key) => {
        replacedHtml = replacedHtml.replaceAll(
          `{{${key}}}`,
          this.getAttribute(key) || ``
        );
      });
      this.#shadow.innerHTML = replacedHtml;
    }

    connectedCallback() {
      this.shadowRoot.addEventListener(`click`, (event) => {
        if (!event.target.matches(`img`)) return
        this.dispatchEvent(
          new CustomEvent(`remove`, {
            detail: this.getAttribute(`label`),
            bubbles: true,
            cancelable: true,
            composed: false,
          })
        );
      })
      
    }

    attributeChangedCallback(name, oldValue, newValue) {
      this.#render();
    }
  }

  customElements.define(`recipe-keyword`, RecipeKeyword);
}
