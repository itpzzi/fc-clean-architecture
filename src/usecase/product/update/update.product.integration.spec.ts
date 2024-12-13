import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import UpdateProductUseCase from "./update.product.usecase";
import Product from "../../../domain/product/entity/product";

describe("Update Product Integration Tests", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should update a product with valid data", async () => {
        const productRepository = new ProductRepository();
        await productRepository.create(
            new Product("1", "Produto X", 100)
        );

        const input = { id: "1", name: "Produto X atualizado", price: 150 };
        const usecase = new UpdateProductUseCase(productRepository);
        const output = await usecase.execute(input);

        expect(output).toEqual({
            id: "1",
            name: "Produto X atualizado",
            price: 150,
        });
    });

    it("should throw an error when updating a non-existent product", async () => {
        const productRepository = new ProductRepository();
        const usecase = new UpdateProductUseCase(productRepository);

        const input = { id: "invalid_id", name: "Produto Inexistente", price: 150 };

        await expect(usecase.execute(input)).rejects.toThrow("Product not found");
    });

    it("should not update a product with a negative price", async () => {
        const productRepository = new ProductRepository();
        await productRepository.create(
            new Product("1", "Produto X", 100)
        );

        const input = { id: "1", name: "Produto X", price: -1 };
        const usecase = new UpdateProductUseCase(productRepository);

        await expect(usecase.execute(input)).rejects.toThrow(
            "Price must be greater than zero"
        );
    });

    it("should not update a product with an empty name", async () => {
        const productRepository = new ProductRepository();
        await productRepository.create(
            new Product("1", "Produto X", 123)
        );

        const input = { id: "1", name: "", price: 123 };
        const usecase = new UpdateProductUseCase(productRepository);

        await expect(usecase.execute(input)).rejects.toThrow("Name is required");
    });

    it("should update only the price of a product", async () => {
        const productRepository = new ProductRepository();
        await productRepository.create(
            new Product("1", "Produto X", 123)
        );

        const input = { id: "1", name: "Produto X", price: 456 };
        const usecase = new UpdateProductUseCase(productRepository);
        const output = await usecase.execute(input);

        expect(output).toEqual({
            id: "1",
            name: "Produto X",
            price: 456,
        });
    });

    it("should persist updated product in the database", async () => {
        const productRepository = new ProductRepository();
        await productRepository.create(
            new Product("1", "Produto X", 100)
        );

        const input = { id: "1", name: "Produto Xtualizado", price: 150 };
        const usecase = new UpdateProductUseCase(productRepository);
        await usecase.execute(input);

        const updatedProduct = await ProductModel.findOne({ where: { id: "1" } });

        expect(updatedProduct?.name).toBe(input.name);
        expect(updatedProduct?.price).toBe(input.price);
    });
});
