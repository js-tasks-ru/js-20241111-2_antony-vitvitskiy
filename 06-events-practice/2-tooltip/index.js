class Tooltip {
  static instance;
  element;

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }
    Tooltip.instance = this;
  }

  initialize () {
    this.createListeners();
  }

  render(message) {
    this.element = this.createTooltipElement(message);
    document.body.append(this.element);
  }

  createTooltipElement(message) {
    const element = document.createElement('div');
    element.innerHTML = this.createTooltipTemplate(message);
    return element.firstElementChild;
  }

  createTooltipTemplate(message) {
    return `<div class="tooltip">${message}</div>`
  }

  handlePointerMove = (event) => {
    if (this.element) {
      this.element.style.left = event.clientX + "px";
      this.element.style.top = event.clientY + "px";
    }
  }

  handlePointerOver = (event) => {
    const targetElement = event.target.closest('[data-tooltip]');

    if (!targetElement) {
      return;
    }

    this.render(targetElement.dataset.tooltip);
    this.element.style.left = event.clientX + "px";
    this.element.style.top = event.clientY + "px";
  }

  handlePointerOut = (event) => {
    if (this.element) {
      this.element.remove();
    }
  }

  createListeners() {
    document.addEventListener('pointermove', this.handlePointerMove);
    document.addEventListener('pointerover', this.handlePointerOver);
    document.addEventListener('pointerout', this.handlePointerOut);
  } 

  destroyListeners() {
    document.removeEventListener('pointermove', this.handlePointerMove);
    document.removeEventListener('pointerover', this.handlePointerOver);
    document.removeEventListener('pointerout', this.handlePointerOut);
  }

  destroy() {
    if (this.element) {
      this.element.remove();
    }
    this.destroyListeners();
  }
}

export default Tooltip;
