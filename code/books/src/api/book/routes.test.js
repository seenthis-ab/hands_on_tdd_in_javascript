import assert from "assert/strict";
import fastify from "fastify";
import { bookRoutes } from "./routes.js";

describe("Books Routes", () => {
  const app = fastify();

  const fakeHttpClient = async () => ({
    ok: true,
    books: [
      {
        id: "some-book-id",
        title: "some-book-title",
        authors: ["Alice", "Bob"],
      },
    ],
  });
  bookRoutes({ httpClient: fakeHttpClient }).forEach((route) =>
    app.route(route)
  );

  describe("GET books", () => {
    it("should respond with status 200", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/books",
      });
      assert.equal(response.statusCode, 200);
    });

    it("should list books return by http fetch", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/books",
      });

      assert.deepEqual(response.json(), [
        {
          id: "some-book-id",
          title: "some-book-title",
          authors: ["Alice", "Bob"],
        },
      ]);
    });
  });
});
