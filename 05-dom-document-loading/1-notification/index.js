export default class NotificationMessage {
    static lastShownNotification;
    element;
    message;

    constructor(message, settings) {
        this.message = message;
        this.duration = settings?.duration;
        this.type = settings?.type;
        this.element = this.createElement(this.createTemplate());
    }

    createElement(template) {
        const element = document.createElement('div');

        element.innerHTML = template;

        return element.firstElementChild;
    }

    createTemplate() {
        return (`
        <div class="notification ${this.type}" style="--value:${this.duration / 1000}s">
            <div class="timer"></div>
            <div class="inner-wrapper">
                <div class="notification-header">${this.type}</div>
                <div class="notification-body">
                    ${this.message}
                </div>
            </div>
        </div>
        `);
    }

    show(container = document.body) {
        if (NotificationMessage.lastShownNotification) {
            NotificationMessage.lastShownNotification.destroy();
        }
        NotificationMessage.lastShownNotification = this;

        container.appendChild(this.element);
        this.timerId = setTimeout(() => this.destroy(), this.duration);
    }

    remove() {
        this.element.remove();
    }

    destroy() {
        this.remove();
        clearTimeout(this.timerId);
    }
}
