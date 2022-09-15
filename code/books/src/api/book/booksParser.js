export function booksParser(books) {
  return books.items.map((item) => ({
    id: item.id,
    title: item.volumeInfo.title,
    authors: item.volumeInfo.authors,
  }));
}
