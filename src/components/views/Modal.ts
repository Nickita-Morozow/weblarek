import { ModalData } from "../../types";
import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export class Modal extends Component<ModalData> {
  private contentElement: HTMLElement;
  private closeButton: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);

    this.contentElement = ensureElement<HTMLElement>(
      ".modal__content",
      container,
    );

    this.closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      container,
    );

    this.closeButton.addEventListener("click", () => this.close());

    container.addEventListener("click", (event) => {
      if (event.target === container) this.close();
    });
  }

  set content(element: HTMLElement) {
    this.contentElement.replaceChildren(element);
  }

  open() {
    this.container.classList.add("modal_active");
  }

  close() {
    this.container.classList.remove("modal_active");
  }
}
