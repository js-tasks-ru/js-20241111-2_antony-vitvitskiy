export default class ColumnChart {
    constructor({
        data = [],
        label = '',
        link = '',
        value = 0,
        formatHeading = data => `USD ${data}`,
    } = {}) {
        this.data = data;
        this.label = label;
        this.link = link;
        this.value = value;
        this.formatHeading = formatHeading;
        this.element = this.createElement(this.createTemplate());
        this.chartHeight = 50;
    }

    createBodyTemplate() {
        const maxValue = Math.max(...this.data);
        const scale = 50 / maxValue;
        
        return this.data.map(item => {
            return `<div style="--value: ${String(Math.floor(item * scale))}" data-tooltip="${(item / maxValue * 100).toFixed(0) + '%'}"></div>`;
        }).join("");
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
                    <a href="/sales" class="column-chart__link">View all</a>
                </div>
                <div class="column-chart__container">
                    <div data-element="header" class="column-chart__header">${this.formatHeading(this.value)}</div>
                    <div data-element="body" class="column-chart__chart">
                        ${this.createBodyTemplate()}
                    </div>
                </div>
            </div>
        `);
    }

    update(data) {
        this.data = data;
        this.element.querySelector('[data-element="body"]').innerHTML = this.createBodyTemplate();
    }

    remove() {
        this.element.remove();
    }

    destroy() {
        this.remove();
    }
}
