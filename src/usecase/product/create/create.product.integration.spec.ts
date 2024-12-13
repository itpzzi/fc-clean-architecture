import { Sequelize } from "sequelize-typescript"
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "./create.product.usecase"
import { InputCreateProductDto } from "./create.product.dto"

const input: InputCreateProductDto = {
    name: "Produto X",
    price: 111,
    type: "a"
}

describe("Test creating products use case", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true }
        });

        await sequelize.addModels([ProductModel])
        await sequelize.sync()
    })

    afterEach(async () => {
        await sequelize.close()
    })

    it("should create a product", async () => {

        const productRepository = new ProductRepository();
        const usecase = new CreateProductUseCase(productRepository)
        const output = await usecase.execute(input)

        expect(output).toEqual({
            id: expect.any(String),
            name: input.name,
            price: input.price,
        })
    })

    it("should not create a product with a negative price", async () => {
        const productRepository = new ProductRepository();
        const usecase = new CreateProductUseCase(productRepository);
        
        const invalidInput = { ...input, price: -10 };
    
        await expect(usecase.execute(invalidInput)).rejects.toThrow("Price must be greater than zero");
    });
    
})