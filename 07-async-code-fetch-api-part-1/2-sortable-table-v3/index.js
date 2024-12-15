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
    this.isDataLoading = false;
    this.render();
  }

  async loadData() {
    this.isDataLoading = true;
    this.element.classList.add("sortable-table_loading");
    this.url.searchParams.set('_sort', this.sorted.id);
    this.url.searchParams.set('_order', this.sorted.order);
    this.url.searchParams.set('_start', this.data.length);
    this.url.searchParams.set('_end', this.data.length + 30);
    const fetchedData = await fetchJson(this.url)
    this.data = this.data.concat(fetchedData);
    this.isDataLoading = false;
    this.element.classList.remove("sortable-table_loading");
    return fetchedData;
  }

  async sortOnServer (id, order) {
    this.subElements.body.innerHTML = '';
    this.data = [];
    this.render();
  }

  async render() {
    try {
      const fetchedData = await this.loadData();
      for (const product of fetchedData) {
        this.subElements.body.insertAdjacentHTML("beforeend", this.createBodyRowTemplate(product));
      }
    } catch {

    }
    if (this.subElements.body.children.length) {
      this.element.classList.remove("sortable-table_empty");
    } else {
      this.element.classList.add("sortable-table_empty");
    }
    this.element.classList.remove("sortable-table_loading");
  }

  handleScroll(e) {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight && !this.isDataLoading) {
      this.render();
    }
  }

  createListeners() {
    super.createListeners();

    this.handleScroll = this.handleScroll.bind(this);

    window.addEventListener('scroll', this.handleScroll);
  }

  destroyListeners() {
    super.destroyListeners();
    window.removeEventListener('scroll', this.handleScroll);
  }
}
