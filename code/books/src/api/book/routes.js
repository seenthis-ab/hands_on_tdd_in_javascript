import { internalServerErrorSchema } from "../commons/schema.js";
import { booksSchema } from "./schema.js";

export function bookRoutes({ httpClient }) {
  return [
    {
      method: "GET",
      url: "/books",
      schema: {
        response: {
          200: booksSchema,
          500: internalServerErrorSchema,
        },
      },
      handler: async (_, reply) => {
        const response = await httpClient(
          "https://www.googleapis.com/books/v1/volumes?q=javascript"
        );

        if (response.ok) {
          reply.send(response.books);
        } else {
          throw Error("Oh no!");
        }
      },
    },
  ];
}
