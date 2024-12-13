import Entity from "../../@shared/entity/entity.abstract";
import ProductInterface from "./product.interface";

export default abstract class ProductBase extends Entity implements ProductInterface {
  protected _id: string;
  protected _name: string;
  protected _price: number;

  constructor(id: string, name: string, price: number) {
    super();
    this._id = id;
    this._name = name;
    this._price = price;
    this.validate();
  }

  get id(): string {
    return this._id;
  }
  
  get name(): string {
    return this._name;
  }

  get price(): number {
    return this._price;
  }

  changeName(name: string): void {
    this._name = name;
    this.validate();
  }

  changePrice(price: number): void {
    this._price = price;
    this.validate();
  }

  checkProps(): void {
    if (this._id.length === 0) {
      this.notification.addError({
        context: "product",
        message: "Id is required"
      });
    }
    if (this._name.length === 0) {
      this.notification.addError({
        context: "product",
        message: "Name is required"
      });
    }
    if (this._price < 0) {
      this.notification.addError({
        context: "product",
        message: "Price must be greater than zero"
      });
    }

  }

  validate(): boolean {
    this.checkProps()
    if(this.notification.hasErrors()) {
      throw new Error(this.notification.messages("product"))
    }
    return true;
  }
}
