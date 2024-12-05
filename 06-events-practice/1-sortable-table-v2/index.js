import SortableTableV1 from "../../05-dom-document-loading/2-sortable-table-v1/index.js";

export default class SortableTableV2 extends SortableTableV1 {
  constructor(headersConfig, {
    data = [],
    sorted = {}
  } = {}) {
    super(headersConfig, data);
    this.arrowElement = this.createArrowElement();
    this.createListeners();
    this.sort(sorted.id, sorted.order);
    const sortedColumn = Array.from(this.subElements.header.children).find((child) => child.dataset.id === sorted.id);
    sortedColumn.dataset.order = sorted.order;
    sortedColumn.append(this.arrowElement);
  }

  createArrowElement() {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = this.createArrowTemplate();
    return tempElement.firstElementChild;
  }

  createArrowTemplate() {
    return (
      `<span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
      </span>`
    );
  }

  handleHeaderPointerDown = (e) => {
    const cellElement = e.target.closest('.sortable-table__cell')

    if (!cellElement) {
      return;
    }

    if (!cellElement.dataset.sortable || cellElement.dataset.sortable === 'false') {
      return;
    }

    cellElement.dataset.order = cellElement.dataset.order === 'desc' ? 'asc' : 'desc';
    cellElement.append(this.arrowElement);

    this.sort(cellElement.dataset.id, cellElement.dataset.order);
  }

  createListeners() {
    this.subElements.header.addEventListener('pointerdown', this.handleHeaderPointerDown);
  }

  destroyListeners() {
    this.subElements.header.removeEventListener('click', this.handleHeaderPointerDown);
  }

  destroy() {
    super.destroy();
    this.destroyListeners();
  }
}
