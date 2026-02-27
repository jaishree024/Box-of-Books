const AuthorRow = ({
  author,
  onApprove,
  onReject,
  onDelete,
  showApprovalActions,
}) => {
  return (
    <tr>
      <td>{author.name}</td>
      <td>{author.email}</td>
      <td>{author.status}</td>

      <td>
        {showApprovalActions && (
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
