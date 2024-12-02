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

    show(targetElement) {
        if (NotificationMessage.lastShownNotification) {
            NotificationMessage.lastShownNotification.destroy();
        }
        NotificationMessage.lastShownNotification = this;

        if (!!targetElement) {
            targetElement.appendChild(this.element);
            return;
        }
        document.body.appendChild(this.element);
        this.remove();
    }

    remove() {
        this.timerId = setTimeout(() => this.element.remove(), this.duration);
    }

    destroy() {
        this.element.remove();
        clearTimeout(this.timerId);
    }
}
