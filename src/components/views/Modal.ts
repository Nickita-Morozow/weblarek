import { Component } from '../base/Component';
export class Modal extends Component<HTMLElement> {
    private contentElement: HTMLElement;
    private closeButton: HTMLButtonElement;
    constructor(container: HTMLElement) {
        super(container);
        this.contentElement = container.querySelector('.modal__content') as HTMLElement;
        this.closeButton = container.querySelector('.modal__close') as HTMLButtonElement;
        this.closeButton.addEventListener('click', () => this.close());
        container.addEventListener('click', (event) => {
            if (event.target === container) this.close();
        });
    }
    set content(element: HTMLElement) { this.contentElement.replaceChildren(element); }
    open() { this.container.classList.add('modal_active'); }
    close() { this.container.classList.remove('modal_active'); }
}
