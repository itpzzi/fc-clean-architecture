import { response } from "express";
import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should create a product", async () => {
        const response = await request(app)
            .post("/product")
            .send({
                name: "Product X",
                price: 123,
                type: "a",
            })

        expect(response.status).toBe(200)
        expect(response.body.name).toBe("Product X")
        expect(response.body.price).toBe(123)
        expect(response.body.id).toEqual(expect.any(String))
    })

    it("should not create a product", async () => {
        const response = await request(app)
            .post("/product")
            .send({
                name: "Product X",
                price: -1,
                type: "a",
            })
        expect(response.status).toBe(500)
    })

    it("should list all products", async () => {
        const responseCreate1 = await request(app)
            .post("/product")
            .send({
                name: "Product X",
                price: 123,
                type: "a",
            })
        const responseCreate2 = await request(app)
            .post("/product")
            .send({
                name: "Product X*2",
                price: 456,
                type: "b",
            })

        const responseList = await request(app)
            .get("/product")
            .send()

        expect(responseCreate1.status).toBe(200)
        expect(responseCreate2.status).toBe(200)
        expect(responseList.status).toBe(200)
        expect(responseList.body.products).toHaveLength(2)
        expect(responseList.body.products[0].name).toBe("Product X")
        expect(responseList.body.products[1].name).toBe("Product X*2")
        expect(responseList.body.products[0].price).toBe(123)
        expect(responseList.body.products[1].price).toBe(912)
        expect(responseList.body.products[0].id).toEqual(expect.any(String))
        expect(responseList.body.products[1].id).toEqual(expect.any(String))
    })
})