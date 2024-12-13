import ColumnChartV1 from '../../04-oop-basic-intro-to-dom/1-column-chart/index.js';
import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart extends ColumnChartV1 {
    subElements = {}

    constructor({
        data = [],
        label = '',
        link = '',
        range = {},
        url = '',
        formatHeading = data => `${data}`,
    } = {}) {
        super();
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

    createUrl(from = this.range.from, to = this.range.to) {
        return BACKEND_URL + "/" + this.url + "?from=" + from + "&to=" + to;
    }

    async fetchData(from, to) {
        this.element.classList.add('column-chart_loading');
        let fetchedData;
        await fetch(this.createUrl(from, to))
                .then(response => response.json())
                .then(data => {
                    this.data = Object.values(data);
                    fetchedData = data;
                    this.subElements.body.innerHTML = this.createBodyTemplate();
                    this.subElements.header.textContent = `${this.formatHeading(this.data.length)}`;
                    this.element.classList.remove('column-chart_loading');
                })
                .catch(err => console.log(err))
        
        return fetchedData;
    }

    async update(from, to) {
        return await this.fetchData(from, to);
    }

    selectSubElements() {
        this.element.querySelectorAll('[data-element]').forEach(element => {
          this.subElements[element.dataset.element] = element;
        });
    }
}
