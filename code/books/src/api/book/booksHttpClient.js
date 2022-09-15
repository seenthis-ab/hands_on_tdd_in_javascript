import { httpClient } from "./httpClient.js";
import { booksParser } from "./booksParser.js";

export async function booksHttpClient(url) {
  const result = await httpClient(url);

  if (result.ok) {
    const books = await result.json();
    return {
      ok: true,
      books: booksParser(books),
    };
  } else {
    return {
      ok: false,
    };
  }
}
