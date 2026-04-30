import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApplications, getNotifications, getTeamByLeaderId, getTeamMemberTeam } from "../services/api";
import { getStoredUser } from "../utils/session";
import "./dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const currentUser = getStoredUser();
  const [team, setTeam] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      if (!currentUser?.userId) {
        setLoading(false);
        return;
      }

      try {
        try {
          const teamResponse = currentUser.role === "TEAM_LEAD"
            ? await getTeamByLeaderId(currentUser.userId)
            : await getTeamMemberTeam(currentUser.userId);

          const teamData = teamResponse.data;
          if (!teamData.members) {
            teamData.members = [];
          }
          setTeam(teamData);

          if (teamData.teamId) {
            const applicationsResponse = await getApplications();
            const filteredApplications = (applicationsResponse.data || []).filter(
              (application) => (application.team?.teamId || application.teamId) === teamData.teamId
            );
            setApplications(filteredApplications);
          }
        } catch (teamError) {
          console.error(teamError);
        }

        const notificationsResponse = await getNotifications(currentUser.userId);
        setNotifications(notificationsResponse.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [currentUser?.userId, currentUser?.role]);

  const formatActivityTime = (timestamp) => {
    if (!timestamp) {
      return "";
    }

    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const summaryCards = useMemo(() => [
    { label: "Team Members", value: team?.members?.length || 0 },
    { label: "Applications", value: applications.length },
    { label: "Notifications", value: notifications.length },
  ], [team, applications.length, notifications.length]);

  const allowedToApply = currentUser?.role === "TEAM_LEAD";

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div>
          <p className="sidebar-eyebrow">Platform</p>
          <h2 className="dashboard-title">{currentUser?.role || "Dashboard"}</h2>
        </div>

        <button onClick={() => navigate("/")}>Home</button>
        <button onClick={() => navigate("/problems")}>Problem Statements</button>
        {allowedToApply && <button onClick={() => navigate("/create-team")}>Add Members</button>}
        {allowedToApply && <button onClick={() => navigate("/my-applications")}>My Applications</button>}
        {!allowedToApply && <button onClick={() => navigate("/team-member-dashboard")}>Team Member View</button>}
        <button onClick={() => navigate("/profile")}>Profile</button>
      </aside>

      <section className="dashboard-content">
        <div className="dashboard-hero">
          <div>
            <p className="sidebar-eyebrow">Welcome back</p>
            <h1>{currentUser?.name || "Participant"}</h1>
            <p>{team ? `Team ${team.teamName}` : "No team linked yet"}</p>
          </div>
          <div className="hero-actions">
            {allowedToApply ? (
              <button onClick={() => navigate("/problems")}>Browse Problems</button>
            ) : (
              <button onClick={() => navigate("/problems")}>View Problems</button>
            )}
          </div>
        </div>

        <div className="summary-grid">
          {summaryCards.map((card) => (
            <div key={card.label} className="summary-card">
              <span>{card.label}</span>
              <strong>{card.value}</strong>
            </div>
          ))}
        </div>

        <div className="dashboard-grid">
          <div className="team-card">
            <h3>My Team</h3>
            {loading ? (
              <p className="no-team">Loading team...</p>
            ) : team ? (
              <>
                <p className="team-name">Team Name: {team.teamName}</p>
                <p>Leader: {team.leader?.fullName || currentUser?.name || "N/A"}</p>
                <div className="members">
                  <p className="member-title">Members:</p>
                  {team.members && team.members.length > 0 ? (
                    team.members.map((member, index) => (
                      <div key={member.memberId || index} className="member-item">
                        {member.name} ({member.email})
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

          <div className="team-card">
            <h3>Recent Activity</h3>
            {notifications.length > 0 ? (
              <div className="activity-list">
                {notifications.map((notification) => (
                  <div key={notification.id || notification.notificationId} className="member-item activity-item">
                    <div>{notification.message}</div>
                    <small className="activity-time">{formatActivityTime(notification.timestamp || notification.createdAt)}</small>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-team">No activity yet</p>
            )}
          </div>
        </div>

        <div className="team-card">
          <h3>Notifications</h3>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div key={notification.id || notification.notificationId} className="member-item">
                {notification.message}
              </div>
            ))
          ) : (
            <p className="no-team">No notifications yet</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
