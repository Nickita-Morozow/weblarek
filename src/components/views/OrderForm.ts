import { OrderFormData } from '../../types';
import { Form } from './Form';

export class OrderForm extends Form<OrderFormData> {
    private paymentButtons: HTMLButtonElement[];
    constructor(container: HTMLFormElement, onSubmit: () => void, onChange: (field: string, value: string) => void) {
        super(container, onSubmit, onChange);
        this.paymentButtons = Array.from(container.querySelectorAll('.order__buttons .button'));
        this.paymentButtons.forEach(button => button.addEventListener('click', () => onChange('payment', button.name)));
    }
    render(data?: Partial<OrderFormData>): HTMLElement {
        if (data) {
            if (data.address !== undefined) this.setField('address', data.address);
            if (data.payment !== undefined) {
                this.paymentButtons.forEach(button => button.classList.toggle('button_alt-active', button.name === data.payment));
            }
        }
        return super.render(data);
    }
}
