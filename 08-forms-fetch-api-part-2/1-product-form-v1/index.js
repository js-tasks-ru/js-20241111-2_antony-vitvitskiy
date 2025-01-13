import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {
  element;
  subElements = {}

  constructor (productId) {
    this.productId = productId;
    this.url = new URL(BACKEND_URL + '/' + 'api/rest/products');
  }

  async render () {
    await this.loadData();
    this.element = this.createElement(this.createTemplate());
    this.selectSubElements();
    document.body.append(this.element);
    this.createListeners();
    document.getElementsByName('subcategory')[0].value = this.productData.subcategory;
    this.subElements.productForm.querySelector(`#title`).value = this.productData.title;
    this.subElements.productForm.querySelector(`#quantity`).value = this.productData.quantity;
    this.subElements.productForm.querySelector(`#price`).value = this.productData.price;
    this.subElements.productForm.querySelector(`#discount`).value = this.productData.discount;
  }

  async loadData() {
    const categoriesUrl = new URL(BACKEND_URL + '/' + 'api/rest/categories');
    categoriesUrl.searchParams.set('_sort', 'weight');
    categoriesUrl.searchParams.set('_refs', 'subcategory');
    this.categories = await fetchJson(categoriesUrl);
    
    this.url.searchParams.set('id', this.productId);
    this.productData = (await fetchJson(this.url))[0];
  }

  selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(element => {
      this.subElements[element.dataset.element] = element;
    });
  }

  createElement(template) {
    const element = document.createElement('div');

    element.innerHTML = template;

    return element.firstElementChild;
  }

  createSelectOptionsTemplate() {
    return this.categories.map((category) => {
      return category.subcategories.map((subcategory) => {
        return `<option value="${escapeHtml(subcategory.id)}">${escapeHtml(category.title)} &gt; ${escapeHtml(subcategory.title)}</option>`;
      }).join('');
    }).join('');
  }

  createImageTemplate() {
    return this.productData.images.map((image) => {
      return `<li class="products-edit__imagelist-item sortable-list__item" style="">
                <input type="hidden" name="url" value="${escapeHtml(image.url)}">
                <input type="hidden" name="source" value="${escapeHtml(image.source)}">
                <span>
                  <img src="icon-grab.svg" data-grab-handle="" alt="grab">
                  <img class="sortable-table__cell-img" alt="Image" src="${escapeHtml(image.url)}">
                  <span>75462242_3746019958756848_838491213769211904_n.jpg</span>
                </span>
                <button type="button">
                  <img src="icon-trash.svg" data-delete-handle="" alt="delete">
                </button>
              </li>`
    }).join('');
  }

  createTemplate() {
    return (`
    <div class="product-form">
    <form data-element="productForm" class="form-grid">
      <div class="form-group form-group__half_left">
        <fieldset>
          <label class="form-label">Название товара</label>
          <input id="title" required="" type="text" name="title" class="form-control" placeholder="Название товара">
        </fieldset>
      </div>
      <div class="form-group form-group__wide">
        <label class="form-label">Описание</label>
        <textarea id="description" required="" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара"></textarea>
      </div>
      <div class="form-group form-group__wide" data-element="sortable-list-container">
        <label class="form-label">Фото</label>
        <div data-element="imageListContainer">
          <ul class="sortable-list">
            ${this.createImageTemplate()}
          </ul>
        </div>
        <button id="buttonUploadImage" type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
      </div>
      <div class="form-group form-group__half_left">
        <label class="form-label">Категория</label>
        <select id="subcategory" class="form-control" name="subcategory">
          ${this.createSelectOptionsTemplate()}
        </select>
      </div>
      <div class="form-group form-group__half_left form-group__two-col">
        <fieldset>
          <label class="form-label">Цена ($)</label>
          <input id="price" required="" type="number" name="price" class="form-control" placeholder="100">
        </fieldset>
        <fieldset>
          <label class="form-label">Скидка ($)</label>
          <input id="discount" required="" type="number" name="discount" class="form-control" placeholder="0">
        </fieldset>
      </div>
      <div class="form-group form-group__part-half">
        <label class="form-label">Количество</label>
        <input id="quantity" required="" type="number" class="form-control" name="quantity" placeholder="1">
      </div>
      <div class="form-group form-group__part-half">
        <label class="form-label">Статус</label>
        <select id="status" class="form-control" name="status">
          <option value="1">Активен</option>
          <option value="0">Неактивен</option>
        </select>
      </div>
      <div class="form-buttons">
        <button type="submit" name="save" class="button-primary-outline">
          Сохранить товар
        </button>
      </div>
    </form>
  </div>
    `);
  }

  async save() {
    const formData = new FormData(this.subElements.productForm);
    const response = await fetchJson(this.url, {
      method: this.productId ? 'PATCH' : 'PUT',
      headers: {
        "Content-Type": "application/json",
      },
      body: formData
    });
    const customEvent = new CustomEvent('product-updated');
    this.element.dispatchEvent(customEvent, {
      detail: formData
    });
  }

  handleUploadImageClick = (event) => {
    const inputElement = document.createElement('input');

    inputElement.type = 'file';
    inputElement.accept = 'image/*';

    inputElement.onchange = async () => {
      const [file] = inputElement.files; // берем первый файл из массива файлов

      if (file) {
        const formData = new FormData();

        formData.append('image', file);

        this.subElements.productForm.elements.uploadImage.classList.add('is-loading');

        const result = await fetchJson('https://api.imgur.com/3/image', {
          method: 'POST',
          headers: {
            Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
          },
          body: formData
        });

        this.subElements.productForm.elements.uploadImage.classList.remove('is-loading');

        this.subElements.imageListContainer.append(this.createElement(
          `<ul class="sortable-list">
            <li class="products-edit__imagelist-item sortable-list__item" style="">
              <input type="hidden" name="url" value="${escapeHtml(result.data.link)}">
              <input type="hidden" name="source" value="${file.name}">
              <span>
                <img src="icon-grab.svg" data-grab-handle="" alt="grab">
                <img class="sortable-table__cell-img" alt="Image" src="${escapeHtml(result.data.link)}">
                <span>75462242_3746019958756848_838491213769211904_n.jpg</span>
              </span>
              <button type="button">
                <img src="icon-trash.svg" data-delete-handle="" alt="delete">
              </button>
            </li>
          </ul>`
        ));

        inputElement.remove();
      }
    };

    document.body.append(inputElement);
    inputElement.click();
  }

  onFormSubmit = (event) => {
    event.preventDefault();
    this.save();
  }

  createListeners() {
    this.subElements.productForm.elements.uploadImage.addEventListener('click', this.handleUploadImageClick);
    this.subElements.productForm.addEventListener('submit', this.onFormSubmit);
  }

  destroyListeners() {
    this.subElements.productForm.elements.uploadImage.removeEventListener('click', this.handleUploadImageClick);
    this.subElements.productForm.removeEventListener('submit', this.onFormSubmit);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.destroyListeners();
    this.remove();
  }
}
