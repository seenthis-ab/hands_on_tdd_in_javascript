import assert from "assert/strict";
import { booksParser } from "./booksParser.js";

describe("The Books Parser", () => {
  const data = {
    items: [
      {
        kind: "books#volume",
        id: "some-book-id",
        etag: "some-etag",
        volumeInfo: {
          title: "some-book-title",
          authors: ["Alice", "Bob"],
        },
      },
    ],
  };

  it("should extract id", () => {
    const parsed = booksParser(data);
    assert.equal(parsed[0].id, data.items[0].id);
  });

  it("should extract title", () => {
    const parsed = booksParser(data);
    assert.equal(parsed[0].title, data.items[0].volumeInfo.title);
  });

  it("should extract authors", async () => {
    const parsed = booksParser(data);
    assert.deepEqual(parsed[0].authors, data.items[0].volumeInfo.authors);
  });
});
