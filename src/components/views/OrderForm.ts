import { OrderFormData, TPayment } from "../../types";
import { IEvents } from "../base/Events";
import { Form } from "./Form";
import { ensureAllElements } from "../../utils/utils";

export class OrderForm extends Form<OrderFormData> {
  private paymentButtons: HTMLButtonElement[];

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events, "order:next");

    this.paymentButtons = ensureAllElements<HTMLButtonElement>(
      ".order__buttons .button",
      container,
    );

    this.paymentButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.events.emit("buyer:input", {
          field: "payment",
          value: button.name,
        });
      });
    });
  }

  set address(value: string) {
    this.setField("address", value);
  }

  set payment(value: TPayment | null) {
    this.paymentButtons.forEach((button) => {
      button.classList.toggle("button_alt-active", button.name === value);
    });
  }
}
