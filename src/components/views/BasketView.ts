import { BasketData } from '../../types';
import { Component } from '../base/Component';

export class BasketView extends Component<BasketData> {
    private listElement: HTMLElement;
    private totalElement: HTMLElement;
    private submitButton: HTMLButtonElement;
    constructor(container: HTMLElement, onOrder: () => void) {
        super(container);
        this.listElement = container.querySelector('.basket__list') as HTMLElement;
        this.totalElement = container.querySelector('.basket__price') as HTMLElement;
        this.submitButton = container.querySelector('.basket__button') as HTMLButtonElement;
        this.submitButton.addEventListener('click', onOrder);
    }
    render(data?: Partial<BasketData>): HTMLElement {
        if (data) {
            if (data.items) {
                if (data.items.length) this.listElement.replaceChildren(...data.items);
                else {
                    const empty = document.createElement('li');
                    empty.textContent = 'Корзина пуста';
                    this.listElement.replaceChildren(empty);
                }
                this.submitButton.disabled = data.items.length === 0;
            }
            if (data.total !== undefined) this.totalElement.textContent = `${data.total} синапсов`;
        }
        return super.render();
    }
}
