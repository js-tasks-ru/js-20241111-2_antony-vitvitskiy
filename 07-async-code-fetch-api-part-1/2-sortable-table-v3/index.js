import SortableTableV1 from '../../05-dom-document-loading/2-sortable-table-v1/index.js';
import SortableTableV2 from '../../06-events-practice/1-sortable-table-v2/index.js';
import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable extends SortableTableV1 {
  constructor(headersConfig, {
    data = [],
    sorted = {
      id: headersConfig.find(item => item.sortable).id,
      order: 'asc'
    },
    url = '',
    isSortLocally = false
  } = {}) {
    super(headersConfig, data);
    this.url = url;
    this.isSortLocally = isSortLocally;
    this.arrowElement = this.createArrowElement();
    this.createListeners();
    this.render();
  }

  async loadData() {
    const url = BACKEND_URL + '/' + this.url;
    // const url = BACKEND_URL + '/' + this.url + `?_sort=${id}` + `&_order=${order}` + `&_start=0&_end=30`;
    this.data = await fetchJson(url);
  }

  sortHandler(id, order) {
      if (this.isSortLocally) {
        this.sortOnClient(id, order);
      } else {
        this.sortOnServer(id, order);
      }
  }

  sortOnClient (id, order) {
    this.sort(id, order);
  }

  async sortOnServer (id, order) {
    
  }

  async render() {
    await this.loadData();
    this.subElements.body.innerHTML = this.createBodyTemplate();
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

    this.sortHandler(cellElement.dataset.id, cellElement.dataset.order);
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
