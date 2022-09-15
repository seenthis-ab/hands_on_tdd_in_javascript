export const itemsSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      id: { type: "string" },
      count: { type: "number" },
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
