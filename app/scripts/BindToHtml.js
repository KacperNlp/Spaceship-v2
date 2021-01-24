export class BindToHtml {
  constructor(id) {
    this.element = this.bindById(id);
  }

  bindById(id) {
    return document.getElementById(id);
  }
}
