import ProductFactory from "../../../domain/product/factory/product.factory"
import FindProductUseCase from "./find.product.usecase"

const product = ProductFactory.create("a", "Product X", 111)

const input = {
    id: product.id
}

const MockRepository = () => {
    return {
        create: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
        findAll: jest.fn(),
        update: jest.fn()
    }
}

describe("Unit Test find product use case", () => {

    it("should find a product", async () => {
        const productRepository = MockRepository()
        const usecase = new FindProductUseCase(productRepository)
        const output = await usecase.execute(input)

        expect(productRepository.find).toHaveBeenCalled()
        expect(output).toEqual({
            id: product.id,
            name: "Product X",
            price: 111
        })
    })

    it("should not find a product", async () => {
        const productRepository = MockRepository()
        productRepository.find.mockImplementation(() => {
            throw new Error("Product not found")
        })

        const usecase = new FindProductUseCase(productRepository)

        expect(() => {
            return usecase.execute({ id: "123" })
        }).rejects.toThrow("Product not found")
    })
})