import { IProduct } from '../../types';
import { Card } from './Card';

export class CatalogCard extends Card<IProduct> {
    constructor(container: HTMLElement, onSelect: () => void) {
        super(container);
        container.addEventListener('click', onSelect);
    }
    render(data?: Partial<IProduct>): HTMLElement {
        if (data) this.setProduct(data as IProduct);
        return super.render();
    }
}
