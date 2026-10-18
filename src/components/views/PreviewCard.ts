import { ICardImage, PreviewData } from "../../types";
import { categoryMap } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Card } from "./Card";

export class PreviewCard extends Card<PreviewData> {
  private actionButton: HTMLButtonElement;
  private descriptionElement: HTMLElement;
  private imageElement: HTMLImageElement;
  private categoryElement: HTMLElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this.descriptionElement = ensureElement<HTMLElement>(
      ".card__text",
      container,
    );

    this.actionButton = ensureElement<HTMLButtonElement>(
      ".card__button",
      container,
    );

    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      container,
    );

    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      container,
    );

    this.actionButton.addEventListener("click", () => {
      this.events.emit("product:action");
    });
  }

  set image(value: ICardImage) {
    this.setImage(this.imageElement, value.src, value.alt);
  }

  set category(value: string) {
    Object.values(categoryMap).forEach((modifier) => {
      this.categoryElement.classList.remove(modifier);
    });

    this.categoryElement.textContent = value;

    const modifier = categoryMap[value as keyof typeof categoryMap];

    if (modifier) {
      this.categoryElement.classList.add(modifier);
    }
  }

  set description(text: string) {
    this.descriptionElement.textContent = text;
  }

  set buttonText(text: string) {
    this.actionButton.textContent = text;
  }

  set buttonDisabled(disabled: boolean) {
    this.actionButton.disabled = disabled;
  }
}
