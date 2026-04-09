import { useEffect, useMemo, useState } from "react";
import { getApplications } from "../services/api";
import "./problemstatements.css";

function Leaderboard() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    getApplications().then((response) => setApplications(response.data || [])).catch(() => setApplications([]));
  }, []);

  const rows = useMemo(() => {
    const map = new Map();

    applications.forEach((application) => {
      const teamId = application.team?.teamId || application.teamId;
      const teamName = application.team?.teamName || "Team";
      const key = `${teamId}-${teamName}`;
      const current = map.get(key) || { teamName, submissions: 0, lastSubmitted: null };
      current.submissions += 1;
      current.lastSubmitted = application.submissionDate || current.lastSubmitted;
      map.set(key, current);
    });

    return Array.from(map.values())
      .sort((left, right) => right.submissions - left.submissions)
      .slice(0, 10)
      .map((item, index) => ({ ...item, rank: index + 1 }));
  }, [applications]);

  return (
    <div className="ps-page">
      <h1 className="ps-title">Leaderboard</h1>
      <p style={{ textAlign: "center", marginBottom: 20 }}>Top teams by live submission activity</p>

      <div className="table-container">
        <table className="ps-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Team</th>
              <th>Submissions</th>
              <th>Last Submitted</th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? rows.map((row) => (
              <tr key={row.teamName + row.rank}>
                <td>{row.rank}</td>
                <td>{row.teamName}</td>
                <td>{row.submissions}</td>
                <td>{row.lastSubmitted ? new Date(row.lastSubmitted).toLocaleString() : "N/A"}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4">No submissions available yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;