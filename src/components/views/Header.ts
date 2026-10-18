import { IEvents } from "../base/Events";
import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

interface HeaderData {
  counter: number;
}

export class Header extends Component<HeaderData> {
  private counterElement: HTMLElement;
  private basketButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this.basketButton = ensureElement<HTMLButtonElement>(
      ".header__basket",
      container,
    );

    this.counterElement = ensureElement<HTMLElement>(
      ".header__basket-counter",
      container,
    );

    this.basketButton.addEventListener("click", () => {
      this.events.emit("basket:open");
    });
  }

  set counter(count: number) {
    this.counterElement.textContent = String(count);
  }
}
