import { IEvents } from "../base/Events";
import { IProduct } from "../../types";
export class Products {
  private items: IProduct[];
  private currentItem: IProduct | null;

  constructor(private events: IEvents) {
    this.items = [];
    this.currentItem = null;
  }

  setItems(items: IProduct[]): void {
    this.items = items;
    this.events.emit("products:changed");
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
    this.events.emit("product:selected");
  }

  getCurrentItem(): IProduct | null {
    return this.currentItem;
  }
}
