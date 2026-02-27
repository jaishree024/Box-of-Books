import API from "./auth";

export const getAllBooks = (params) => API.get("/books", { params });
