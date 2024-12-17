import ValidatorInterface from "../../@shared/validator/validator.interface";
import ProductBase from "../entity/product-base";
import ProductYupValidator from "../validator/product.yup.validator";

export default class ProductValidatorFactory {
  static create(): ValidatorInterface<ProductBase> {
    return new ProductYupValidator();
  }
}
