import { IProduct } from "../../types";
export class Basket {
  private basketItems: IProduct[];

  constructor() {
    this.basketItems = [];
  }

  getItems(): IProduct[] {
    return this.basketItems;
  }

  addToBasket(item: IProduct): void {
    this.basketItems.push(item);
  }

  removeFromBasket(item: IProduct): void {
    const correctedBasket = this.basketItems.filter(
      (product) => product.id !== item.id,
    );
    this.basketItems = correctedBasket;
  }

  clearBasket(): void {
    this.basketItems = [];
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
