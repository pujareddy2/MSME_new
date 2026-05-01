import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProblemById } from "../services/api";
import { getStoredTeam, getStoredUser } from "../utils/session";
import { unwrapApiData } from "../services/api";

function ProblemDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const currentUser = getStoredUser();
  const currentTeam = getStoredTeam();

  useEffect(() => {
    if (!id) {
      return;
    }

    getProblemById(id)
      .then((response) => setProblem(unwrapApiData(response)))
      .catch(() => setProblem(null));
  }, [id]);

  if (!problem) {
    return <h2 style={{ padding: "80px" }}>Problem Not Found</h2>;
  }

  return (
    <div className="ps-details-container">

      <h2 className="ps-title">{problem.title || problem.problemTitle}</h2>

      {/* Problem Info Table */}

      <table className="ps-info-table">

        <tbody>

          <tr>
            <td className="label">Organization</td>
            <td>{problem.org || problem.organizationName || "Organization Innovation Platform"}</td>
          </tr>

          <tr>
            <td className="label">Category</td>
            <td>{problem.category || problem.domain}</td>
          </tr>

          <tr>
            <td className="label">Theme</td>
            <td>{problem.theme || problem.difficultyLevel}</td>
          </tr>

          <tr>
            <td className="label">Deadline</td>
            <td>{problem.deadline || problem.submissionDeadline}</td>
          </tr>

        </tbody>

      </table>


      {/* Description */}

      <div className="ps-description">
        <h3>Problem Description</h3>
        <p>{problem.description || problem.problemDescription}</p>
      </div>


      <button
        className="apply-btn"
        onClick={() => {
          const userRole = currentUser?.role || localStorage.getItem("role");

          if (!currentUser) {
            navigate("/login");
            return;
          }

          if (userRole !== "TEAM_LEAD") {
            alert("Only Team Leaders can submit applications.");
            return;
          }

          if (!currentTeam?.teamId) {
            alert("You must add team members before applying.");
            navigate("/create-team");
            return;
          }

          navigate(`/apply/${id}`);
        }}
      >
        Apply
      </button>

    </div>
  );
}

export default ProblemDetails;