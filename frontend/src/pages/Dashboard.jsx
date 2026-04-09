import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);

  useEffect(() => {
    const savedTeam = localStorage.getItem("team");

    if (savedTeam) {
      try {
        const parsed = JSON.parse(savedTeam);

        // ✅ ensure members always exists
        if (!parsed.members) {
          parsed.members = [];
        }

        setTeam(parsed);
      } catch (e) {
        console.error("Invalid team data");
      }
    }
  }, []);

  return (
    <div className="dashboard-container">

      <h2 className="dashboard-title">Dashboard</h2>

      {/* TEAM CARD */}
      <div className="team-card">
        <h3>Team Details</h3>

        {team ? (
          <>
            <p className="team-name">Team Name: {team.teamName}</p>

            <div className="members">
              <p className="member-title">Members:</p>

              {team.members && team.members.length > 0 ? (
                team.members.map((m, index) => (
                  <div key={index} className="member-item">
                    {m.name} ({m.email})
                  </div>
                ))
              ) : (
                <p>No members found</p>
              )}
            </div>
          </>
        ) : (
          <p className="no-team">No team created yet</p>
        )}
      </div>

      {/* BUTTONS */}
      <div className="dashboard-buttons">
        <button onClick={() => navigate("/create-team")}>
          Create Team
        </button>

        <button onClick={() => navigate("/problems")}>
          View Problems
        </button>

        <button onClick={() => navigate("/my-applications")}>
          My Applications
        </button>
      </div>

    </div>
  );
}

export default Dashboard;