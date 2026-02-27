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
  const [showPendingOnly, setShowPendingOnly] = useState(false);

  const fetchAuthors = async () => {
    const res = await getAuthors(showPendingOnly ? "pending" : null);
    setAuthors(res.data);
  };

  useEffect(() => {
    fetchAuthors();
  }, [showPendingOnly]);

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
        <h1>Admin Dashboard 👑</h1>

        <button
          onClick={() => setShowPendingOnly(!showPendingOnly)}
          style={{ marginBottom: "15px" }}
        >
          {showPendingOnly ? "Show All Authors" : "Show Pending Authors"}
        </button>

        <table border="1" cellPadding="10" cellSpacing="0" width="100%">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {authors.map((author) => (
              <AuthorRow
                key={author._id}
                author={author}
                onApprove={handleApprove}
                onReject={handleReject}
                onDelete={handleDelete}
                showApprovalActions={showPendingOnly}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminDashboard;
