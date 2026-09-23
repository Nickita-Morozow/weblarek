import { IProduct } from "../../types";
export class Products {
  items: IProduct[];
  curItem: IProduct | null;

  constructor() {
    this.items = [];
    this.curItem = null;
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
    this.curItem = item;
  }

  getCurItem(): IProduct | null {
    return this.curItem;
  }
}
