import { TPayment, IBuyerData, IBuyerErrors } from "../../types";
export class Buyer {
  private payment: TPayment | null;
  private address: string;
  private phone: string;
  private email: string;

  constructor() {
    this.payment = null;
    this.address = this.phone = this.email = "";
  }

  setData(data: Partial<IBuyerData>): void {
    if (data.email !== undefined) {
      this.email = data.email;
    }
    if (data.address !== undefined) {
      this.address = data.address;
    }
    if (data.phone !== undefined) {
      this.phone = data.phone;
    }
    if (data.payment !== undefined) {
      this.payment = data.payment;
    }
  }

  getData(): IBuyerData {
    return {
      payment: this.payment,
      address: this.address,
      phone: this.phone,
      email: this.email,
    };
  }

  clearData(): void {
    this.payment = null;
    this.address = this.phone = this.email = "";
  }

  validateData(): IBuyerErrors {
    const errors: IBuyerErrors = {};
    if (this.payment === null) {
      errors.payment = "Необходимо выбрать способ оплаты";
    }
    if (this.address === "") {
      errors.address = "Необходимо указать адрес";
    }
    if (this.phone === "") {
      errors.phone = "Необходимо указать номер телефона";
    }
    if (this.email === "") {
      errors.email = "Необходимо указать адрес электронной почты";
    }
    return errors;
  }
}
