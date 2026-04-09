import { useParams, useNavigate } from "react-router-dom";
import problemData from "../data/problemData";

function ProblemDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const problem = problemData.find(
    (item) => item.id === parseInt(id)
  );

  if (!problem) {
    return <h2 style={{ padding: "80px" }}>Problem Not Found</h2>;
  }

  return (
    <div className="ps-details-container">

      <h2 className="ps-title">{problem.title}</h2>

      {/* Problem Info Table */}

      <table className="ps-info-table">

        <tbody>

          <tr>
            <td className="label">Organization</td>
            <td>{problem.org}</td>
          </tr>

          <tr>
            <td className="label">Category</td>
            <td>{problem.category}</td>
          </tr>

          <tr>
            <td className="label">Theme</td>
            <td>{problem.theme}</td>
          </tr>

          <tr>
            <td className="label">Deadline</td>
            <td>{problem.deadline}</td>
          </tr>

        </tbody>

      </table>


      {/* Description */}

      <div className="ps-description">
        <h3>Problem Description</h3>
        <p>{problem.description}</p>
      </div>


      <button
        className="apply-btn"
        onClick={() => navigate(`/apply/${id}`)}
      >
        Apply
      </button>

    </div>
  );
}

export default ProblemDetails;