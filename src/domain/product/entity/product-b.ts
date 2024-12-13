import ProductBase from "./product-base";

export default class ProductB extends ProductBase {
  constructor(id: string, name: string, price: number) {
    super(id, name, price);
  }

  get price(): number {
    return this._price * 2;
  }
}
