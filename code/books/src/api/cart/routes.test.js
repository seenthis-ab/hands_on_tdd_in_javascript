import assert from "assert/strict";
import fastify from "fastify";
import sinon from "sinon";
import { cartRoutes } from "./routes.js";

describe("Cart Routes", () => {
  const app = fastify();
  const repository = {
    createCart: () => {
      throw new Error("Not implemented!");
    },
    saveCart: () => {
      throw new Error("Not implemented!");
    },
    getCart: () => {
      throw new Error("Not implemented!");
    },
  };

  cartRoutes({ repository }).forEach((route) => app.route(route));

  const url = "/cart";
  const fakeId = "123";

  describe("Create new cart", () => {
    afterEach(() => {
      sinon.restore();
    });

    it("should return status code 201", async () => {
      sinon.replace(repository, "createCart", sinon.fake.resolves(fakeId));

      const response = await app.inject({
        method: "POST",
        url,
      });

      assert.equal(response.statusCode, 201);
    });

    it("should return location header", async () => {
      sinon.replace(repository, "createCart", sinon.fake.resolves(fakeId));

      const response = await app.inject({
        method: "POST",
        url,
      });

      assert.equal(response.headers["location"], `/cart/${fakeId}`);
    });
  });

  describe("Update cart", () => {
    const item = {
      id: "some-item-id",
      count: 2,
      title: "some-item-title",
      authors: ["Alice", "Bob"],
    };

    const payload = {
      id: fakeId,
      items: [item],
    };

    afterEach(() => {
      sinon.restore();
    });

    it("should return status code 200", async () => {
      sinon.replace(repository, "saveCart", sinon.fake.resolves(payload));

      const response = await app.inject({
        method: "PUT",
        url: `${url}/${fakeId}`,
        payload: [item],
      });

      assert.equal(response.statusCode, 200);
    });

    it("should return current state", async () => {
      sinon.replace(repository, "saveCart", sinon.fake.resolves(payload));

      const response = await app.inject({
        method: "PUT",
        url: `${url}/${fakeId}`,
        payload: [item],
      });

      const result = await response.json();
      assert.deepEqual(result, [item]);
    });

    it("should return status code 404 when resource was not found", async () => {
      sinon.replace(repository, "saveCart", sinon.fake.resolves(null));

      const response = await app.inject({
        method: "PUT",
        url: `${url}/${fakeId}`,
        payload: [item],
      });

      assert.equal(response.statusCode, 404);
    });
  });

  describe("Read Cart", () => {
    afterEach(() => {
      sinon.restore();
    });

    const item = {
      id: "some-item-id",
      count: 2,
      title: "some-item-title",
    };

    const payload = {
      id: fakeId,
      items: [item],
    };

    it("should return status code 200", async () => {
      sinon.replace(repository, "getCart", sinon.fake.resolves(payload));

      const response = await app.inject({
        method: "GET",
        url: `${url}/${fakeId}`,
      });

      assert.equal(response.statusCode, 200);
    });

    it("should return cart", async () => {
      sinon.replace(repository, "getCart", sinon.fake.resolves(payload));

      const response = await app.inject({
        method: "GET",
        url: `${url}/${fakeId}`,
      });

      const result = await response.json();

      assert.deepEqual(result, [item]);
    });

    it("should return status code 404 when resource was not found", async () => {
      sinon.replace(repository, "getCart", sinon.fake.resolves(null));

      const response = await app.inject({
        method: "GET",
        url: `${url}/${fakeId}`,
      });

      assert.equal(response.statusCode, 404);
    });
  });
});
