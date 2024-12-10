import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
    subElements = {}

    constructor({
        data = [],
        label = '',
        link = '',
        range = {},
        url = '',
        formatHeading = data => `${data}`,
    } = {}) {
        this.data = data;
        this.label = label;
        this.link = link;
        this.range = range;
        this.url = url;
        this.formatHeading = formatHeading;
        this.element = this.createElement(this.createTemplate());
        this.chartHeight = 50;
        this.selectSubElements();
        this.fetchData();
    }

    createBodyTemplate() {
        const maxValue = Math.max(...Object.values(this.data));
        const scale = this.chartHeight / maxValue;

        return Object.values(this.data).map(item => {
            return `<div style="--value: ${String(Math.floor(item * scale))}" data-tooltip="${(item / maxValue * 100).toFixed(0) + '%'}"></div>`;
        }).join("");
    }

    createUrl(from = this.range.from, to = this.range.to) {
        return BACKEND_URL + "/" + this.url + "?from=" + from + "&to=" + to;
    }

    async fetchData(from, to) {
        this.element.classList.add('column-chart_loading');
        await fetch(this.createUrl(from, to))
                .then(response => response.json())
                .then(data => {
                    this.data = data;
                    this.subElements.body.innerHTML = this.createBodyTemplate();
                    this.subElements.header.textContent = `${this.formatHeading(Object.entries(this.data).length)}`;
                    this.element.classList.remove('column-chart_loading');
                })
                .catch(err => console.log(err))
    }

    createElement(template) {
        const element = document.createElement('div');

        element.innerHTML = template;

        return element.firstElementChild;
    }

    createTemplate() {
        return (`
            <div class="column-chart ${this.data.length ? "" : `column-chart_loading`}" style="--chart-height: 50">
                <div class="column-chart__title">
                    ${this.label}
                    ${this.link ? `<a href="${this.link}" class="column-chart__link">View all</a>` : ""}
                </div>
                <div class="column-chart__container">
                    <div data-element="header" class="column-chart__header"></div>
                    <div data-element="body" class="column-chart__chart">
                    </div>
                </div>
            </div>
        `);
    }

    async update(from, to) {
        await this.fetchData(from, to);

        return this.data;
    }

    selectSubElements() {
        this.element.querySelectorAll('[data-element]').forEach(element => {
          this.subElements[element.dataset.element] = element;
        });
    }

    remove() {
        this.element.remove();
    }

    destroy() {
        this.remove();
    }
}
