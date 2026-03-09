import { useEffect, useState } from "react";
import {
  getAuthors,
  approveAuthor,
  rejectAuthor,
  deleteAuthor,
} from "../../api/admin";

import AuthorRow from "../../components/admin/AuthorRow";
import Navbar from "../../components/Navbar";

const AdminDashboard = () => {
  const [authors, setAuthors] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 1,
  });

  const fetchAuthors = async () => {
    const res = await getAuthors({
      status: statusFilter === "all" ? undefined : statusFilter,
      page,
      pageSize,
    });

    setAuthors(res.data.authors);
    setPagination(res.data.pagination);

    if (page > res.data.pagination.totalPages) {
      setPage(res.data.pagination.totalPages);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, [statusFilter, page, pageSize]);

  const handleApprove = async (id) => {
    await approveAuthor(id);
    fetchAuthors();
  };

  const handleReject = async (id) => {
    await rejectAuthor(id);
    fetchAuthors();
  };

  const handleDelete = async (id) => {
    await deleteAuthor(id);
    fetchAuthors();
  };

  return (
    <>
      <Navbar />

      <div style={{ padding: "30px" }}>
        <h1>Admin Dashboard</h1>

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="statusFilter">Filter: </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All Authors</option>
            <option value="active">Approved</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <table border="1" cellPadding="10" cellSpacing="0" width="100%">
          <thead>
            <tr>
              <th>Sr No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {authors.map((author, index) => (
              <AuthorRow
                key={author._id}
                srNo={(pagination.page - 1) * pagination.pageSize + index + 1}
                author={author}
                onApprove={handleApprove}
                onReject={handleReject}
                onDelete={handleDelete}
              />
            ))}
          </tbody>
        </table>

        <div
          style={{
            marginTop: "15px",
            display: "flex",
            gap: "12px",
            alignItems: "center",
          }}
        >
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
          >
            Prev
          </button>

          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <button
            onClick={() =>
              setPage((prev) => Math.min(pagination.totalPages, prev + 1))
            }
            disabled={page === pagination.totalPages}
          >
            Next
          </button>

          <label htmlFor="pageSizeSelect">Page Size: </label>
          <select
            id="pageSizeSelect"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
