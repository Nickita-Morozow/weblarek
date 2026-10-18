import { IEvents } from "../base/Events";
import { IProduct } from "../../types";
export class Basket {
  private basketItems: IProduct[];

  constructor(private events: IEvents) {
    this.basketItems = [];
  }

  getItems(): IProduct[] {
    return this.basketItems;
  }

  addToBasket(item: IProduct): void {
    if (!this.isInBasket(item.id)) this.basketItems.push(item);
    this.events.emit("basket:changed");
  }

  removeFromBasket(item: IProduct): void {
    const correctedBasket = this.basketItems.filter(
      (product) => product.id !== item.id,
    );
    this.basketItems = correctedBasket;
    this.events.emit("basket:changed");
  }

  clearBasket(): void {
    this.basketItems = [];
    this.events.emit("basket:changed");
  }

  getTotalPrice(): number {
    return this.basketItems.reduce((sum, item) => {
      return sum + (item.price ?? 0);
    }, 0);
  }

  getItemsNumber(): number {
    return this.basketItems.length;
  }

  isInBasket(itemId: string): boolean {
    return this.basketItems.some((item) => item.id === itemId);
  }
}
