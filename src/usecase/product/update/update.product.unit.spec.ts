import ProductFactory from "../../../domain/product/factory/product.factory"
import UpdateProductUseCase from "./update.product.usecase"

const product = ProductFactory.create("a", "Product X", 111)

const input = {
    id: product.id,
    name: "Product Y",
    price: 222
}

const MockRepository = () => ({
    create: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
    findAll: jest.fn(),
    update: jest.fn(),
})

describe("Unit Test update product use case", () => {

    it("should update a product", async () => {
        const productRepository = MockRepository()
        const usecase = new UpdateProductUseCase(productRepository)
        const output = await usecase.execute(input)

        expect(output).toEqual(input)
    })

})