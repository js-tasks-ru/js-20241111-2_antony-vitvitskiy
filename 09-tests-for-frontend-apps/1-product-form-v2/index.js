import ProductForm from '../../08-forms-fetch-api-part-2/1-product-form-v1/index.js';
import SortableList from '../2-sortable-list/index.js';
import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductFormV2 extends ProductForm {
  sortableLists = [];

  constructor (productId) {
    super();
    this.productId = productId;
  }

  async render () {
    await super.render();
    const sortableLists = this.element.getElementsByClassName('sortable-list');
    for (const sortableList of sortableLists) {
      this.sortableLists.push(new SortableList({items: sortableList}));
    }
  }
}
