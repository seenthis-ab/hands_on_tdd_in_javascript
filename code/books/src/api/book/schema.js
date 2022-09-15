export const booksSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      id: { type: "string" },
      title: { type: "string" },
      authors: {
        type: "array",
        items: {
          type: "string",
        },
      },
    },
  },
};
