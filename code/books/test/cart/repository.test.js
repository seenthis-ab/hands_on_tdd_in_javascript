import assert from "assert/strict";
import pkg from "pg";
import { repository } from "../../src/persistence/cart/repository.js";
const { Pool } = pkg;

describe("Cart Repository", () => {
  let dbPool;
  let repo;

  before(async () => {
    dbPool = new Pool({
      host: "localhost",
      user: "developer",
      password: "secret",
      database: "books_test",
      port: 5432,
    });

    repo = repository(dbPool);

    await dbPool.query("TRUNCATE TABLE cart");
  });

  after(async () => {
    await dbPool.end();
  });

  it("should create new cart", async () => {
    const cartId = await repo.createCart();
    const result = await dbPool.query("SELECT * FROM cart WHERE cart_id = $1", [
      cartId,
    ]);
    assert.equal(result.rowCount, 1);
  });

  it("should update items in cart", async () => {
    const cartId = await repo.createCart();
    const item = {
      count: 1,
      title: "some-item",
    };
    const updated = await repo.saveCart(cartId, [item]);

    const result = await dbPool.query(
      "SELECT items FROM cart WHERE cart_id = $1",
      [cartId]
    );

    const acutalItems = JSON.parse(result.rows[0].items);
    assert.deepEqual(acutalItems[0], item);
    assert.deepEqual(item, updated.items[0]);
  });

  it("should return null when saving a cart does not exist", async () => {
    const cartId = "bogus-id";
    const item = {
      count: 1,
      title: "some-item",
    };
    const updated = await repo.saveCart(cartId, [item]);

    await dbPool.query("SELECT items FROM cart WHERE cart_id = $1", [cartId]);

    assert.equal(updated, null);
  });

  it("should read items from cart", async () => {
    const cartId = await repo.createCart();
    const item = {
      count: 1,
      title: "some-item",
    };
    await repo.saveCart(cartId, [item]);

    const expected = {
      id: cartId,
      items: [item],
    };

    const actual = await repo.getCart(cartId);
    assert.deepEqual(actual, expected);
  });

  it("should return null when reading a cart that does not exist", async () => {
    const cartId = "bogus-id";
    const result = await repo.getCart(cartId);

    assert.equal(result, null);
  });
});
