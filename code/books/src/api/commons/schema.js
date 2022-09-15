export const notFoundSchema = {
  type: "object",
  properties: {
    message: { type: "string" },
    error: { type: "string" },
    statusCode: { type: "number" },
  },
};

export const internalServerErrorSchema = {
  type: "object",
  properties: {
    error: { type: "string" },
    statusCode: { type: "number" },
  },
};
