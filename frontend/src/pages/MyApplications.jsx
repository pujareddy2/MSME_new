import { useEffect, useState } from "react";
import { getApplications } from "../services/api";
import { getStoredTeam, getStoredUser } from "../utils/session";
import "./dashboard.css";

function MyApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = getStoredUser();
  const currentTeam = getStoredTeam();

  useEffect(() => {
    getApplications()
      .then((response) => {
        const allApplications = response.data || [];
        if (currentTeam?.teamId && currentUser?.role !== "ADMIN") {
          setApps(
            allApplications.filter(
              (application) => (application.team?.teamId || application.teamId) === currentTeam.teamId
            )
          );
          return;
        }

        setApps(allApplications);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [currentTeam?.teamId, currentUser?.role]);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">My Applications</h2>

      {loading ? (
        <p className="no-team">Loading applications...</p>
      ) : apps.length === 0 ? (
        <p className="no-team">No applications submitted yet</p>
      ) : (
        <table className="application-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Status</th>
              <th>Abstract</th>
              <th>File</th>
              <th>Date</th>
              <th>Team</th>
              <th>Problem</th>
            </tr>
          </thead>

          <tbody>
            {apps.map((app) => (
              <tr key={app.applicationId || app.id}>
                <td>{app.applicationId || app.id}</td>

                <td>{app.submissionStatus || app.status || "Submitted"}</td>

                <td>
                  {app.abstractText
                    ? app.abstractText.substring(0, 40) + "..."
                    : "N/A"}
                </td>

                <td>{app.pptFileName || "Uploaded file"}</td>

                <td>
                  {app.submissionDate
                    ? new Date(app.submissionDate).toLocaleString()
                    : "N/A"}
                </td>

                <td>{app.team?.teamName || "N/A"}</td>

                <td>{app.problem?.problemTitle || app.problem?.title || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MyApplications;