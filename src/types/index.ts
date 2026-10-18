export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

export type TPayment = "card" | "cash";

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export type IBuyerData = Omit<IBuyer, "payment"> & {
  payment: TPayment | null;
};

export type IBuyerErrors = Partial<Record<keyof IBuyerData, string>>;

export interface IProductResponse {
  total: number;
  items: IProduct[];
}

export interface IOrder extends IBuyer {
  total: number;
  items: string[];
}

export interface IOrderResponse {
  id: string;
  total: number;
}

// Типы данных слоя представления (View)
export interface PageData { items: HTMLElement[]; counter: number }
export interface BasketData { items: HTMLElement[]; total: number }
export interface FormData { valid: boolean; errors: string[] }
export interface OrderFormData extends FormData { payment: TPayment | null; address: string }
export interface ContactsFormData extends FormData { email: string; phone: string }
export interface SuccessData { total: number }
export type PreviewData = IProduct & { inBasket: boolean };
export type BasketCardData = IProduct & { index: number };
