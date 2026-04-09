import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApplications } from "../services/api";
import "./evaluator.css";

function EvaluatorDashboard() {
  const [applications, setApplications] = useState([]);
  const currentRole = localStorage.getItem("role");
  const navigate = useNavigate();
  const isAllowed = currentRole === "JUDGE" || currentRole === "EVALUATOR";

  useEffect(() => {
    getApplications()
      .then((response) => setApplications(response.data))
      .catch((error) => {
        console.error(error);
        setApplications([]);
      });
  }, []);

  if (!isAllowed) {
    return <p style={{ padding: "80px" }}>Access restricted</p>;
  }

  return (
    <div className="evaluator-container">

      <h2 className="title">TS-MSME Evaluation Dashboard</h2>

      <h3 className="subtitle">Student Level Evaluation</h3>

      <table className="eval-table">
        <thead>
          <tr>
            <th>Problem ID</th>
            <th>Team Name</th>
            <th>Leader</th>
            <th>View</th>
          </tr>
        </thead>

        <tbody>
          {applications.length === 0 ? (
            <tr>
              <td colSpan="4">No Applications Found</td>
            </tr>
          ) : (
            applications.map((app, index) => (
              <tr key={index}>
                <td>{app.problem?.problemId || app.problem?.id || "N/A"}</td>
                <td>{app.team?.teamName || "N/A"}</td>
                <td>{app.team?.members?.[0]?.name || "N/A"}</td>

                <td>
                  <button
                    className="eval-btn"
                    onClick={() =>
                      navigate("/evaluate", { state: { app } })
                    }
                  >
                    Evaluate
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

    </div>
  );
}

export default EvaluatorDashboard;