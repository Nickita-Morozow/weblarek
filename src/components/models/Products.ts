import { IProduct } from "../../types";
export class Products {
  private items: IProduct[];
  private currentItem: IProduct | null;

  constructor() {
    this.items = [];
    this.currentItem = null;
  }

  setItems(items: IProduct[]): void {
    this.items = items;
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getItem(itemId: string): IProduct | null {
    const item = this.items.find((item) => item.id === itemId) ?? null;
    return item;
  }

  setItem(item: IProduct): void {
    this.currentItem = item;
  }

  getCurrentItem(): IProduct | null {
    return this.currentItem;
  }
}
