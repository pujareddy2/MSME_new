import { useEffect, useState } from "react";
import "./dashboard.css";

function MyApplications() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/applications")
      .then((res) => res.json())
      .then((data) => setApps(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">My Applications</h2>

      {apps.length === 0 ? (
        <p className="no-team">No applications submitted yet</p>
      ) : (
        <table className="application-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Abstract</th>
              <th>Version</th>
              <th>Date</th>
              <th>Team</th>
              <th>Problem</th>
            </tr>
          </thead>

          <tbody>
            {apps.map((app) => (
              <tr key={app.applicationId}>
                <td>{app.applicationId}</td>

                <td>
                  {app.abstractText
                    ? app.abstractText.substring(0, 40) + "..."
                    : "N/A"}
                </td>

                <td>{app.submissionVersion || "N/A"}</td>

                <td>
                  {app.submissionDate
                    ? new Date(app.submissionDate).toLocaleString()
                    : "N/A"}
                </td>

                <td>{app.team?.teamName || "N/A"}</td>

                <td>{app.problem?.problemTitle || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MyApplications;