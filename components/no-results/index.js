// https://stackoverflow.com/questions/55080103/how-to-separate-web-components-to-individual-files-and-load-them
// single file component alternative
// https://ckeditor.com/blog/implementing-single-file-web-components/

const request = fetch(`/components/no-results/template.html`)
  .then((stream) => stream.text())
  .then((text) => define(text));

export default request;

function define(html) {
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
}
