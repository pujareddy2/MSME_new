import { useEffect, useMemo, useState } from "react";
import { getProfile, getTeamMemberApplications, getTeamMemberTeam } from "../services/api";
import { getStoredUser } from "../utils/session";
import "./dashboard.css";

function Profile() {
  const currentUser = useMemo(() => getStoredUser(), []);
  const [profile, setProfile] = useState(currentUser);
  const [team, setTeam] = useState(null);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    async function loadProfile() {
      if (!currentUser?.userId) {
        return;
      }

      try {
        const profileResponse = await getProfile(currentUser.userId);
        setProfile(profileResponse.data);

        if (currentUser.role === "TEAM_MEMBER") {
          const teamResponse = await getTeamMemberTeam(currentUser.userId);
          setTeam(teamResponse.data);
          if (teamResponse.data?.teamId) {
            const applicationsResponse = await getTeamMemberApplications(teamResponse.data.teamId);
            setApplications(applicationsResponse.data || []);
          }
        }
      } catch {
        setProfile(currentUser);
      }
    }

    loadProfile();
  }, [currentUser]);

  return (
    <div className="dashboard-content">
      <div className="team-card">
        <h2 className="dashboard-title">Profile</h2>
        <p className="team-name">Name: {profile?.name || profile?.fullName || "N/A"}</p>
        <p>Email: {profile?.email || "N/A"}</p>
        <p>Phone: {profile?.phone || profile?.phoneNumber || "N/A"}</p>
        <p>Role: {profile?.role || profile?.roleName || "N/A"}</p>
        <p>College: {profile?.collegeId || "N/A"}</p>
      </div>

      {team && (
        <div className="team-card" style={{ marginTop: 18 }}>
          <h3>Team Overview</h3>
          <p className="team-name">Team: {team.teamName}</p>
          <p>Leader: {team.leader?.fullName || team.leader?.name || "N/A"}</p>
          <p>Members: {team.members?.length || 0}</p>
        </div>
      )}

      {applications.length > 0 && (
        <div className="team-card" style={{ marginTop: 18 }}>
          <h3>Recent Applications</h3>
          {applications.map((application) => (
            <div key={application.applicationId || application.id} className="member-item">
              {application.problem?.problemTitle || application.problem?.title || "Problem"}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;