import { SuccessData } from '../../types';
import { Component } from '../base/Component';

export class Success extends Component<SuccessData> {
    private descriptionElement: HTMLElement;
    private closeButton: HTMLButtonElement;
    constructor(container: HTMLElement, onClose: () => void) {
        super(container);
        this.descriptionElement = container.querySelector('.order-success__description') as HTMLElement;
        this.closeButton = container.querySelector('.order-success__close') as HTMLButtonElement;
        this.closeButton.addEventListener('click', onClose);
    }
    render(data?: Partial<SuccessData>): HTMLElement {
        if (data?.total !== undefined) this.descriptionElement.textContent = `Списано ${data.total} синапсов`;
        return super.render();
    }
}
