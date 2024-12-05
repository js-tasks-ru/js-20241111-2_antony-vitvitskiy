export default class SortableTableV1 {
  element;
  subElements = {}
  
  constructor(headerConfig = [], data = []) {
      this.headerConfig = headerConfig;
      this.data = data;
      this.element = this.createElement(this.createTemplate());
      this.selectSubElements();
  }

  sort(field, param) {
    const headerConfigFieldIndex = this.headerConfig.findIndex((configColumn) => configColumn.id === field);

    let sorted;
    if (this.headerConfig[headerConfigFieldIndex].sortType === 'string') {
      sorted = [...this.getTableRowsElements()].sort( (a, b) => (param === 'asc') 
                                  ? a.children[headerConfigFieldIndex].textContent.localeCompare(b.children[headerConfigFieldIndex].textContent, ['ru', 'en'], { caseFirst: "upper" }) 
                                  : (param === 'desc') 
                                    ? b.children[headerConfigFieldIndex].textContent.localeCompare(a.children[headerConfigFieldIndex].textContent, ['ru', 'en'], { caseFirst: "upper" }) 
                                    : 0);
    } else {
      sorted = [...this.getTableRowsElements()].sort( (a, b) => (param === 'asc') 
                                                                ? a.children[headerConfigFieldIndex].textContent - b.children[headerConfigFieldIndex].textContent 
                                                                : b.children[headerConfigFieldIndex].textContent - a.children[headerConfigFieldIndex].textContent );
    }

    sorted.forEach(element => this.subElements.body.appendChild(element));
  }

  selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(element => {
      this.subElements[element.dataset.element] = element;
    });
  }

  getTableRowsElements() {
    return this.subElements.body.children;
  }

  createElement(template) {
    const element = document.createElement('div');

    element.innerHTML = template;

    return element.firstElementChild;
  }

  createHeaderTemplate() {
    return this.headerConfig.map((columnConfig) => {
      return (`
        <div class="sortable-table__cell" data-id="${columnConfig.id}" data-sortable="${columnConfig.sortable}">
          <span>${columnConfig.title}</span>
        </div>
      `);
    }).join('');
  }

  createBodyRowTemplate(product) {
    return (`
      <a href="/products/3d-ochki-epson-elpgs03" class="sortable-table__row">
      ${this.headerConfig.map((columnConfig) => 
        this.createBodyCellTemplate(product, columnConfig)
      ).join('')}
      </a>
    `);
  }

  createBodyTemplate() {
    return this.data.map((product) => {
      return this.createBodyRowTemplate(product);
    }).join('');
  }

  createBodyCellTemplate(product, columnConfig) {
    if (columnConfig.id === 'images') {
      return (`
        <div class="sortable-table__cell">
          <img class="sortable-table-image" alt="Image" src="${product.images[Math.floor(Math.random() * product.images.length)].url}">
        </div> 
      `);
    }

    return (`
      <div class="sortable-table__cell">${product[columnConfig.id]}</div> 
    `);
  }

  createTemplate() {
      return (`
      <div class="sortable-table">

      <div data-element="header" class="sortable-table__header sortable-table__row">
        ${this.createHeaderTemplate()}
      </div>

      <div data-element="body" class="sortable-table__body">
        ${this.createBodyTemplate()}
      </div>

      <div data-element="loading" class="loading-line sortable-table__loading-line"></div>

      <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
        <div>
          <p>No products satisfies your filter criteria</p>
          <button type="button" class="button-primary-outline">Reset all filters</button>
        </div>
      </div>

    </div>
      `);
  }

  destroy() {
    this.element.remove();
  }
}

