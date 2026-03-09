import API from "./auth";

export const getAuthors = ({ status, page, pageSize }) =>
  API.get("/admin/authors", {
    params: {
      ...(status ? { status } : {}),
      page,
      pageSize,
    },
  });

export const approveAuthor = (id) => API.put(`/admin/authors/${id}/approve`);

export const rejectAuthor = (id) => API.put(`/admin/authors/${id}/reject`);

export const deleteAuthor = (id) => API.delete(`/admin/authors/${id}`);
