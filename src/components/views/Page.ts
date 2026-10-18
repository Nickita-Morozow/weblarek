import { PageData } from '../../types';
import { Component } from '../base/Component';

export class Page extends Component<PageData> {
    private galleryElement: HTMLElement;
    private counterElement: HTMLElement;
    private basketButton: HTMLButtonElement;
    constructor(container: HTMLElement, onBasket: () => void) {
        super(container);
        this.galleryElement = container.querySelector('.gallery') as HTMLElement;
        this.basketButton = container.querySelector('.header__basket') as HTMLButtonElement;
        this.counterElement = this.basketButton.querySelector('.header__basket-counter') as HTMLElement;
        this.basketButton.addEventListener('click', onBasket);
    }
    set items(items: HTMLElement[]) { this.galleryElement.replaceChildren(...items); }
    set counter(count: number) { this.counterElement.textContent = String(count); }
}
