import API from "./auth";

export const getMyBooks = () => API.get("/author/allbooks");

export const addBook = (data) => API.post("/author/addbook", data);

export const editBook = (id, data) => API.put(`/author/books/${id}`, data);

export const deleteBook = (id) => API.delete(`/author/books/${id}`);
