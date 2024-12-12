import Product from "../../../domain/product/entity/product"
import { v4 as uuid } from "uuid"
import ProductB from "../../../domain/product/entity/product-b"
import CreateProductUseCase from "./create.product.usecase"
import { InputCreateProductDto } from "./create.product.dto"

const input: InputCreateProductDto = {
    name: "Produto X",
    price: 111,
    type: "a"
}

const MockRepository = () => ({
    create: jest.fn(),
    update: jest.fn(),
    find: jest.fn(),
    findAll: jest.fn()
})

describe("Unit test for creating products use case", () => {
    it("should create a product", async () => {

        const productRepository = MockRepository()
        const usecase = new CreateProductUseCase(productRepository)
        const output = await usecase.execute(input)

        expect(output).toEqual({
            id: expect.any(String),
            name: input.name,
            price: input.price,
        })
        expect(productRepository.create).toHaveBeenCalled()
    })

    it("should thrown an error when name is missing", async () => {
        const productRepository = MockRepository();
        const usecase = new CreateProductUseCase(productRepository);

        await expect(usecase.execute({...input, name: ""})).rejects.toThrow(
            "Name is required"
        );
    });

    it("should thrown an error when price is not greater than zero", async () => {
        const productRepository = MockRepository();
        const usecase = new CreateProductUseCase(productRepository);

        await expect(usecase.execute({...input, price: -0.1})).rejects.toThrow(
            "Price must be greater than zero"
        );
    });
})