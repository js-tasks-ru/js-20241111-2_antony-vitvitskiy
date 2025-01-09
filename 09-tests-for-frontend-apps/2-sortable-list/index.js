export default class SortableList {
    element;

    constructor({items = []}) {
        this.element = document.createElement('ul');
        this.element.classList.add('sortable-list');
        items.forEach((item) => {
            item.classList.add('sortable-list__item');
            this.element.append(item);
        });
        this.createListeners();
    }

    createElement(template) {
        const element = document.createElement('div');

        element.innerHTML = template;

        return element.firstElementChild;
    }

    createPlaceholderTemplate() {
        return `<div class='sortable-list__placeholder'></div>`
    }

    pointerDownHandler(event) {
        event.preventDefault();
        this.draggableItem = event.target.closest('.sortable-list__item');
        if (!this.draggableItem) {
            return;
        }
        if (event.target.hasAttribute("data-delete-handle")) {
            this.draggableItem.remove();
            return;
        }
        if (!event.target.hasAttribute("data-grab-handle")) {
            return;
        }

        const shiftX = event.clientX - this.draggableItem.getBoundingClientRect().left;
        const shiftY = event.clientY - this.draggableItem.getBoundingClientRect().top;

        this.draggableItem.ondragstart = function() {
            return false;
        }

        document.onpointerup = () => {
            this.draggableItem.style = null;
            this.draggableItem.classList.remove('sortable-list__item_dragging');
            this.placeholder.replaceWith(this.draggableItem);
            document.removeEventListener('pointermove', onPointerMove);
        }

        const moveAt = (pageX, pageY) => {
            this.draggableItem.style.left = pageX - shiftX + 'px';
            this.draggableItem.style.top = pageY - shiftY + 'px';
        }

        const onPointerMove = (event) => {
            moveAt(event.pageX, event.pageY);

            this.draggableItem.style.display = "none";
            this.elementBelow = document.elementFromPoint(event.clientX, event.clientY);
            this.draggableItem.style.display = "";

            if (!this.elementBelow || !this.elementBelow.classList.contains('sortable-list__item')) {
                return;
            }
            
            if (event.pageY < this.elementBelow.getBoundingClientRect().top - this.elementBelow.getBoundingClientRect().height / 2 
                || event.pageY < this.elementBelow.getBoundingClientRect().bottom - this.elementBelow.getBoundingClientRect().height / 2) {
                this.elementBelow.before(this.placeholder);
            } else {
                this.elementBelow.after(this.placeholder);
            }
        }

        if (!this.placeholder) {
            this.placeholder = this.createElement(this.createPlaceholderTemplate());
            this.placeholder.style.height = this.draggableItem.offsetHeight + 'px';
        }
        this.draggableItem.after(this.placeholder);
        this.element.append(this.draggableItem);
        this.draggableItem.style.width = this.draggableItem.getBoundingClientRect().width + 'px';
        this.draggableItem.classList.add('sortable-list__item_dragging');
        moveAt(event.pageX, event.pageY);
        document.addEventListener('pointermove', onPointerMove);
    }

    pointerUpHandler = () => {
        if (this.draggableItem) {
            this.draggableItem.style = null;
            this.draggableItem.classList.remove('sortable-list__item_dragging');
            this.placeholder.replaceWith(this.draggableItem);
        }
    }

    createListeners() {
        this.pointerDownHandler = this.pointerDownHandler.bind(this);
        this.element.addEventListener('pointerdown', this.pointerDownHandler);
    }
    
    destroyListeners() {
        this.element.removeEventListener('pointerdown', this.pointerDownHandler);
    }

    remove() {
        this.element.remove();
    }

    destroy() {
        this.destroyListeners();
        this.remove();
    }
}
