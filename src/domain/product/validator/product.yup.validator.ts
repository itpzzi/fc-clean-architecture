import ValidatorInterface from "../../@shared/validator/validator.interface";
import * as yup from "yup";
import ProductBase from "../entity/product-base";

export default class ProductYupValidator
  implements ValidatorInterface<ProductBase>
{
  validate(entity: ProductBase): void {
    try {
      yup
        .object()
        .shape({
          id: yup.string().required("Id is required"),
          name: yup.string().required("Name is required"),
          price: yup.number().required("Price is required").moreThan(0, "Price must be greater than zero"),
        })
        .validateSync(
          {
            id: entity.id,
            name: entity.name,
            price: entity.price
          },
          {
            abortEarly: false,
          }
        );
    } catch (errors) {
      const e = errors as yup.ValidationError;
      e.errors.forEach((error) => {
        entity.notification.addError({
          context: "product",
          message: error,
        });
      });
    }
  }
}
