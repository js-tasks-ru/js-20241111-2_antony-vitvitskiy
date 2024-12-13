import SortableTableV1 from '../../05-dom-document-loading/2-sortable-table-v1/index.js';
import SortableTableV2 from '../../06-events-practice/1-sortable-table-v2/index.js';
import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable extends SortableTableV2 {
  constructor(headersConfig, {
    data = [],
    sorted = {},
    url = '',
    isSortLocally = false
  } = {}) {
    super(headersConfig, data);
    this.url = new URL(BACKEND_URL + '/' + url);
    this.sorted = sorted;
    this.isSortLocally = isSortLocally;
    this.render();
  }

  async loadData() {
    this.url.searchParams.set('_sort', this.sorted.id);
    this.url.searchParams.set('_order', this.sorted.order);
    this.url.searchParams.set('_start', this.data.length);
    this.url.searchParams.set('_end', this.data.length + 30);
    this.data = await fetchJson(this.url);
  }

  async sortOnServer (id, order) {
    this.subElements.body.innerHTML = '';
    this.render();
  }

  async render() {
    await this.loadData();
    this.subElements.body.innerHTML = this.createBodyTemplate();
  }

  handleScroll = (e) => {
    console.log("scrolling");
  }

  createListeners() {
    super.createListeners();
    window.addEventListener('scroll', this.handleScroll);
  }

  destroyListeners() {
    super.destroyListeners();
    window.removeEventListener('scroll', this.handleScroll);
  }
}
