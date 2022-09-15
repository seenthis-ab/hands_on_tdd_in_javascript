import { nanoid } from "nanoid";

async function createCart(pool) {
  const id = nanoid();
  const res = await pool.query(
    "INSERT INTO cart(cart_id) values($1) RETURNING cart_id",
    [id]
  );
  return res.rows[0].cart_id;
}

async function saveCart(pool, cartId, items) {
  const res = await pool.query(
    "UPDATE cart SET items = $1 WHERE cart_id = $2 RETURNING cart_id, items",
    [JSON.stringify(items), cartId]
  );

  if (res.rowCount < 1) {
    return null;
  }

  const row = res.rows[0];

  return {
    id: row.cart_id,
    items: row.items ? JSON.parse(row.items) : [],
  };
}

async function getCart(pool, cartId) {
  const res = await pool.query(
    "SELECT cart_id, items FROM cart WHERE cart_id = $1",
    [cartId]
  );

  if (res.rowCount < 1) {
    return null;
  }

  return {
    id: res.rows[0].cart_id,
    items: JSON.parse(res.rows[0].items),
  };
}

export const repository = (dbPool) => ({
  getCart: (cartId) => getCart(dbPool, cartId),
  saveCart: (cartId, items) => saveCart(dbPool, cartId, items),
  createCart: () => createCart(dbPool),
});
