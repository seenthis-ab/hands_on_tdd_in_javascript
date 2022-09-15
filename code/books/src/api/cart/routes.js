import { itemsSchema } from "./schema.js";
import {
  notFoundSchema,
  internalServerErrorSchema,
} from "../commons/schema.js";

export function cartRoutes({ repository }) {
  return [
    {
      method: "POST",
      url: "/cart",
      schema: {
        response: {
          201: {},
          500: internalServerErrorSchema,
        },
      },
      handler: async (request, reply) => {
        const id = await repository.createCart();
        reply.header("location", `${request.url}/${id}`);
        reply.status(201).send();
      },
    },
    {
      method: "PUT",
      url: "/cart/:id",
      schema: {
        params: {
          id: { type: "string" },
        },
        body: itemsSchema,
        response: {
          200: itemsSchema,
          404: notFoundSchema,
          500: internalServerErrorSchema,
        },
      },
      handler: async (request, reply) => {
        const { id } = request.params;
        const current = await repository.saveCart(id, request.body);

        if (current) {
          reply.send(current.items);
        } else {
          reply.callNotFound();
        }
      },
    },
    {
      method: "GET",
      url: "/cart/:id",
      schema: {
        params: {
          id: { type: "string" },
        },
        response: {
          200: itemsSchema,
          404: notFoundSchema,
          500: internalServerErrorSchema,
        },
      },
      handler: async (request, reply) => {
        // fetch resource
        const { id } = request.params;
        const cart = await repository.getCart(id);

        if (cart) {
          reply.send(cart.items);
        } else {
          reply.callNotFound();
        }
      },
    },
  ];
}
