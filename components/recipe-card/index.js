import html from "./template.html?raw";

class RecipeCard extends HTMLElement {
  constructor() {
    super();
    this._data = {};
  }

  static get observedAttributes() {
    return [`data`];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    console.log(`attributeChangedCallback`);
    if (oldVal !== newVal) {
      // this.#render();
    }
  }

  #render() {
    const shadow = this.attachShadow({ mode: `open` });
    let replacedHtml = html;
    [`name`, `time`, `servings`, `description`].forEach((key) => {
      replacedHtml = replacedHtml.replaceAll(`{{${key}}}`, this._data[key]);
    });
    const ingredientsHtml = this._data.ingredients
      .map(
        (i) =>
          `<dl><dt>${i.ingredient}</dt><dd>${i.quantity ? i.quantity : ``}${
            i.quantity && i.unit ? ` ${i.unit}` : ``
          }</dd></dl>`
      )
      .join(``);
    replacedHtml = replacedHtml.replaceAll(`{{ingredients}}`, ingredientsHtml);
    shadow.innerHTML = replacedHtml;
  }

  get data() {
    return this._data;
  }
  set data(newVal) {
    this._data = newVal;
    this.#render();
  }
}

customElements.define(`recipe-card`, RecipeCard);
