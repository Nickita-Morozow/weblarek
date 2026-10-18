import { ContactsFormData } from "../../types";
import { IEvents } from "../base/Events";
import { Form } from "./Form";

export class ContactsForm extends Form<ContactsFormData> {
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events, "order:submit");
  }

  set email(value: string) {
    this.setField("email", value);
  }

  set phone(value: string) {
    this.setField("phone", value);
  }
}
