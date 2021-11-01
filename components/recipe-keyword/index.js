import html from "./template.html?raw";

class RecipeKeyword extends HTMLElement {
  #shadow;
  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: `open` });
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
      if (!event.target.matches(`img`)) return;
      this.dispatchEvent(
        new CustomEvent(`remove`, {
          detail: this.getAttribute(`label`),
          bubbles: true,
          cancelable: true,
          composed: false,
        })
      );
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.#render();
  }
}

customElements.define(`recipe-keyword`, RecipeKeyword);
