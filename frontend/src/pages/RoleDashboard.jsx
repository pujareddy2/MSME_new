import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApplications, getNotifications, getTeamByLeaderId, getTeamMemberTeam } from "../services/api";
import { getStoredUser } from "../utils/session";
import "./dashboard.css";

function RoleDashboard({ role }) {
  const navigate = useNavigate();
  const currentUser = getStoredUser();
  const resolvedRole = role || currentUser?.role || "ROLE";
  const [team, setTeam] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!currentUser?.userId) {
        setLoading(false);
        return;
      }

      try {
        const isLeader = resolvedRole === "TEAM_LEAD";
        const teamResponse = isLeader
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

        const notificationsResponse = await getNotifications(currentUser.userId);
        setNotifications(notificationsResponse.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [currentUser?.userId, resolvedRole]);

  const summaryCards = useMemo(() => {
    const common = [
      { label: "Notifications", value: notifications.length },
      { label: "Applications", value: applications.length },
    ];

    if (resolvedRole === "TEAM_MEMBER") {
      return [
        { label: "Team Members", value: team?.members?.length || 0 },
        ...common,
      ];
    }

    if (resolvedRole === "MENTOR") {
      return [
        { label: "Assigned Teams", value: team ? 1 : 0 },
        ...common,
      ];
    }

    if (resolvedRole === "JUDGE" || resolvedRole === "EVALUATOR") {
      return [
        { label: "Pending Reviews", value: applications.length },
        ...common,
      ];
    }

    return [
      { label: "Team Members", value: team?.members?.length || 0 },
      ...common,
    ];
  }, [resolvedRole, team, applications.length, notifications.length]);

  const primaryAction = () => {
    if (resolvedRole === "TEAM_MEMBER") {
      navigate("/problems");
      return;
    }

    if (resolvedRole === "MENTOR") {
      navigate("/profile");
      return;
    }

    if (resolvedRole === "JUDGE" || resolvedRole === "EVALUATOR") {
      navigate("/evaluator");
      return;
    }

    if (resolvedRole === "EVENT_HEAD") {
      navigate("/add-problem");
      return;
    }

    if (resolvedRole === "ADMIN") {
      navigate("/add-problem");
      return;
    }

    if (resolvedRole === "COLLEGE_SPOC") {
      navigate("/problems");
      return;
    }

    navigate("/problems");
  };

  const sidebarButtons = [
    { label: "Home", action: () => navigate("/") },
    { label: "Problem Statements", action: () => navigate("/problems") },
    { label: "Profile", action: () => navigate("/profile") },
  ];

  if (resolvedRole === "TEAM_MEMBER") {
    sidebarButtons.push({ label: "Team View", action: () => navigate("/team-member-dashboard") });
  }

  if (resolvedRole === "MENTOR") {
    sidebarButtons.push({ label: "Mentor Notes", action: () => navigate("/profile") });
  }

  if (resolvedRole === "JUDGE" || resolvedRole === "EVALUATOR") {
    sidebarButtons.push({ label: "Evaluation", action: () => navigate("/evaluator") });
  }

  if (resolvedRole === "EVENT_HEAD" || resolvedRole === "ADMIN") {
    sidebarButtons.push({ label: "Problem Admin", action: () => navigate("/add-problem") });
  }

  if (resolvedRole === "COLLEGE_SPOC") {
    sidebarButtons.push({ label: "College Overview", action: () => navigate("/problems") });
  }

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div>
          <p className="sidebar-eyebrow">MSME Hackathon</p>
          <h2 className="dashboard-title">{resolvedRole.replaceAll("_", " ")}</h2>
        </div>

        {sidebarButtons.map((button) => (
          <button key={button.label} onClick={button.action}>{button.label}</button>
        ))}
      </aside>

      <section className="dashboard-content">
        <div className="dashboard-hero">
          <div>
            <p className="sidebar-eyebrow">Role dashboard</p>
            <h1>{currentUser?.name || "Participant"}</h1>
            <p>{team ? `Team ${team.teamName}` : "No linked team found"}</p>
          </div>
          <div className="hero-actions">
            <button onClick={primaryAction}>Open Workspace</button>
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
            <h3>{resolvedRole === "TEAM_MEMBER" ? "Team Information" : "Overview"}</h3>
            {loading ? (
              <p className="no-team">Loading...</p>
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
              <p className="no-team">No linked team found</p>
            )}
          </div>

          <div className="team-card">
            <h3>{resolvedRole === "TEAM_MEMBER" ? "Application Status" : "Recent Activity"}</h3>
            {applications.length > 0 ? (
              applications.slice(0, 5).map((application) => (
                <div key={application.applicationId || application.id} className="member-item">
                  {application.problem?.problemTitle || application.problem?.title || "Problem"}
                  <div>{application.submissionStatus || application.status || "Submitted"}</div>
                </div>
              ))
            ) : (
              <p className="no-team">No applications yet</p>
            )}
          </div>
        </div>

        <div className="team-card">
          <h3>Notifications</h3>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div key={notification.notificationId} className="member-item">
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

export default RoleDashboard;