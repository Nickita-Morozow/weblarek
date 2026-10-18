import { FormState } from "../../types";
import { ensureElement, ensureAllElements } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export abstract class Form<T extends FormState> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;
  protected inputs: HTMLInputElement[];
  protected events: IEvents;

  constructor(
    container: HTMLFormElement,
    events: IEvents,
    submitEvent: string,
  ) {
    super(container);

    this.events = events;

    this.submitButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      container,
    );

    this.errorsElement = ensureElement<HTMLElement>(".form__errors", container);

    this.inputs = ensureAllElements<HTMLInputElement>("input", container);

    this.inputs.forEach((input) => {
      input.addEventListener("input", () => {
        this.events.emit("buyer:input", {
          field: input.name,
          value: input.value,
        });
      });
    });

    container.addEventListener("submit", (event) => {
      event.preventDefault();
      this.events.emit(submitEvent);
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string[]) {
    this.errorsElement.textContent = value.join("; ");
  }

  protected setField(name: string, value: string) {
    const field = this.inputs.find((input) => input.name === name);

    if (field) {
      field.value = value;
    }
  }
}
