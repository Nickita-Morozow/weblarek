import { ContactsFormData } from '../../types';
import { Form } from './Form';

export class ContactsForm extends Form<ContactsFormData> {
    render(data?: Partial<ContactsFormData>): HTMLElement {
        if (data) {
            if (data.email !== undefined) this.setField('email', data.email);
            if (data.phone !== undefined) this.setField('phone', data.phone);
        }
        return super.render(data);
    }
}
