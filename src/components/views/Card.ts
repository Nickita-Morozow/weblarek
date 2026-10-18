import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { categoryMap, CDN_URL } from '../../utils/constants';

export abstract class Card<T> extends Component<T> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected categoryElement: HTMLElement | null;
    protected imageElement: HTMLImageElement | null;

    constructor(container: HTMLElement) {
        super(container);
        this.titleElement = container.querySelector('.card__title') as HTMLElement;
        this.priceElement = container.querySelector('.card__price') as HTMLElement;
        this.categoryElement = container.querySelector('.card__category');
        this.imageElement = container.querySelector('.card__image');
    }

    protected setProduct(product: IProduct): void {
        this.titleElement.textContent = product.title;
        this.priceElement.textContent = product.price === null ? 'Бесценно' : `${product.price} синапсов`;
        if (this.imageElement) {
            this.setImage(this.imageElement, `${CDN_URL}${product.image}`, product.title);
        }
        if (this.categoryElement) {
            Object.values(categoryMap).forEach(modifier => this.categoryElement?.classList.remove(modifier));
            this.categoryElement.textContent = product.category;
            const modifier = categoryMap[product.category as keyof typeof categoryMap];
            if (modifier) this.categoryElement.classList.add(modifier);
        }
    }
}
