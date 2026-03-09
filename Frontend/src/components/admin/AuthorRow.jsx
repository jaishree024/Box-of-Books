const AuthorRow = ({
  srNo,
  author,
  onApprove,
  onReject,
  onDelete,
}) => {
  return (
    <tr>
      <td>{srNo}</td>
      <td>{author.name}</td>
      <td>{author.email}</td>

      <td>
        {author.status === "pending" && (
          <>
            <button onClick={() => onApprove(author._id)}>Approve</button>
            <button onClick={() => onReject(author._id)}>Reject</button>
          </>
        )}

        <button onClick={() => onDelete(author._id)}>Delete</button>
      </td>
    </tr>
  );
};

export default AuthorRow;
