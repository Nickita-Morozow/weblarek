import { PreviewData } from '../../types';
import { Card } from './Card';


export class PreviewCard extends Card<PreviewData> {
    private actionButton: HTMLButtonElement;
    private descriptionElement: HTMLElement;
    constructor(container: HTMLElement, onAction: () => void) {
        super(container);
        this.descriptionElement = container.querySelector('.card__text') as HTMLElement;
        this.actionButton = container.querySelector('.card__button') as HTMLButtonElement;
        this.actionButton.addEventListener('click', onAction);
    }
    render(data?: Partial<PreviewData>): HTMLElement {
        if (data) {
            this.setProduct(data as PreviewData);
            this.description = data.description ?? '';
            this.actionButton.disabled = data.price === null;
            this.actionButton.textContent = data.price === null ? 'Недоступно' : data.inBasket ? 'Удалить из корзины' : 'Купить';
        }
        return super.render();
    }
    set description(text: string) {
        this.descriptionElement.textContent = text;
    }
}
