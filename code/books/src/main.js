import fastify from "fastify";
import swagger from "@fastify/swagger";
import { nanoid } from "nanoid";
import { bookRoutes } from "./api/book/routes.js";
import { cartRoutes } from "./api/cart/routes.js";
import { booksHttpClient } from "./api/book/booksHttpClient.js";
import { repository } from "./persistence/cart/repository.js";
import pkg from "pg";
const { Pool } = pkg;

const postgres = new Pool({
  host: process.env.POSTGRES_HOST || "127.0.0.1",
  port: process.env.POSTGRES_PORT || "5432",
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

const app = fastify({
  logger: {
    logLevel: "info",
  },
  genReqId: () => nanoid(),
});

app.register(swagger, {
  swagger: {
    info: {
      title: "Book Shop",
    },
  },
  exposeRoute: true,
});

app.register((api, _, done) => {
  bookRoutes({ httpClient: booksHttpClient }).forEach((r) => api.route(r));
  cartRoutes({ repository: repository(postgres) }).forEach((r) => api.route(r));
  done();
});

function shutdown() {
  postgres.end();
  process.exit(0);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

try {
  app.listen({ port: 8080, host: "0.0.0.0" });
} catch (err) {
  console.log(err); // eslint-disable-line no-console
}
