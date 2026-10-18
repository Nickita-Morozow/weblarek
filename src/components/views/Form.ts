import { FormData } from '../../types';
import { Component } from '../base/Component';

export abstract class Form<T extends FormData> extends Component<T> {
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;
    protected inputs: HTMLInputElement[];
    constructor(container: HTMLFormElement, onSubmit: () => void, onChange: (field: string, value: string) => void) {
        super(container);
        this.submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;
        this.errorsElement = container.querySelector('.form__errors') as HTMLElement;
        this.inputs = Array.from(container.querySelectorAll('input'));
        this.inputs.forEach(input => input.addEventListener('input', () => onChange(input.name, input.value)));
        container.addEventListener('submit', (event) => {
            event.preventDefault();
            if (!this.submitButton.disabled) onSubmit();
        });
    }
    render(data?: Partial<T>): HTMLElement {
        if (data) {
            if (data.valid !== undefined) this.submitButton.disabled = !data.valid;
            if (data.errors) this.errorsElement.textContent = data.errors.join('; ');
        }
        return super.render();
    }
    protected setField(name: string, value: string) {
        const field = this.inputs.find(input => input.name === name);
        if (field) field.value = value;
    }
}
