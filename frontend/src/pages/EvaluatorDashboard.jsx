import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./evaluator.css";

function EvaluatorDashboard() {
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedApps =
      JSON.parse(localStorage.getItem("applications")) || [];

    setApplications(storedApps);
  }, []);

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
                <td>{app.problemId}</td>
                <td>{app.team.teamName}</td>
                <td>{app.team.members[0]?.name}</td>

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