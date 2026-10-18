import { BasketData } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class BasketView extends Component<BasketData> {
  private listElement: HTMLElement;
  private totalElement: HTMLElement;
  private submitButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this.listElement = ensureElement<HTMLElement>(".basket__list", container);

    this.totalElement = ensureElement<HTMLElement>(".basket__price", container);

    this.submitButton = ensureElement<HTMLButtonElement>(
      ".basket__button",
      container,
    );

    this.submitButton.addEventListener("click", () => {
      this.events.emit("order:open");
    });
  }

  set items(items: HTMLElement[]) {
    this.listElement.replaceChildren(...items);
  }

  set total(total: number) {
    this.totalElement.textContent = `${total} синапсов`;
  }

  set valid(valid: boolean) {
    this.submitButton.disabled = !valid;
  }
}
