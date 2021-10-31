// https://stackoverflow.com/questions/55080103/how-to-separate-web-components-to-individual-files-and-load-them
// single file component alternative
// https://ckeditor.com/blog/implementing-single-file-web-components/

const request = fetch(`/components/filter-select/template.html`)
  .then((stream) => stream.text())
  .then((text) => define(text));

export default request;

function define(html) {
  class FilterSelect extends HTMLElement {
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
    }
  }

  customElements.define(`filter-select`, FilterSelect);
}
