import { SuccessData } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export class Success extends Component<SuccessData> {
  private descriptionElement: HTMLElement;
  private closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, onClose: () => void) {
    super(container);

    this.descriptionElement = ensureElement<HTMLElement>(
      ".order-success__description",
      container,
    );

    this.closeButton = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      container,
    );

    this.closeButton.addEventListener("click", onClose);
  }

  set total(value: number) {
    this.descriptionElement.textContent = `Списано ${value} синапсов`;
  }
}
