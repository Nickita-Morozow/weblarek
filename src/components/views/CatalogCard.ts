import { CatalogCardData, ICardImage } from "../../types";
import { categoryMap } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";

export class CatalogCard extends Card<CatalogCardData> {
  private imageElement: HTMLImageElement;
  private categoryElement: HTMLElement;

  constructor(container: HTMLElement, onSelect: () => void) {
    super(container);

    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      container,
    );

    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      container,
    );

    container.addEventListener("click", onSelect);
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
}
