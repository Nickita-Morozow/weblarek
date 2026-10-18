import { BasketCardData } from '../../types';
import { Card } from './Card';


export class BasketCard extends Card<BasketCardData> {
    private indexElement: HTMLElement;
    private deleteButton: HTMLButtonElement;
    constructor(container: HTMLElement, onDelete: () => void) {
        super(container);
        this.indexElement = container.querySelector('.basket__item-index') as HTMLElement;
        this.deleteButton = container.querySelector('.basket__item-delete') as HTMLButtonElement;
        this.deleteButton.addEventListener('click', onDelete);
    }
    render(data?: Partial<BasketCardData>): HTMLElement {
        if (data) {
            this.setProduct(data as BasketCardData);
            this.indexElement.textContent = String(data.index);
        }
        return super.render();
    }
}
