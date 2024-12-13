import ProductBase from "./product-base";

export default class Product extends ProductBase {
  constructor(id: string, name: string, price: number) {
    super(id, name, price);
  }
}
