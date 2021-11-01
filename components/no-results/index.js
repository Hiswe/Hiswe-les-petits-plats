import html from "./template.html?raw";

class NoResults extends HTMLElement {
  constructor() {
    super();
    this.#render();
  }

  #render() {
    const shadow = this.attachShadow({ mode: `open` });
    shadow.innerHTML = html;
  }
}

customElements.define(`no-results`, NoResults);
