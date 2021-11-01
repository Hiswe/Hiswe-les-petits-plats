import html from "./template.html?raw";
import style from "./style.css?url";

class SearchBar extends HTMLElement {
  #inputElement;

  constructor() {
    super();
    this.#render();
  }

  #render() {
    const shadow = this.attachShadow({ mode: `open` });
    console.log({ style });
    shadow.innerHTML = `<link rel="stylesheet" href="${style}" />${html}`;
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

// }
