import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getTeamByLeaderId, getTeamMemberTeam, login } from "../services/api";
import { saveSession } from "../utils/session";
import "./login.css";

function Login() {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const source = searchParams.get("source");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const routeByRole = (userRole) => {
    if (userRole === "TEAM_MEMBER") {
      navigate("/team-member-dashboard");
      return;
    }

    if (userRole === "JUDGE" || userRole === "EVALUATOR") {
      navigate("/evaluator");
      return;
    }

    if (userRole === "MENTOR") {
      navigate("/mentor-dashboard");
      return;
    }

    if (userRole === "EVENT_HEAD") {
      navigate("/event-head-dashboard");
      return;
    }

    if (userRole === "ADMIN") {
      navigate("/admin-dashboard");
      return;
    }

    if (userRole === "COLLEGE_SPOC") {
      navigate("/spoc-dashboard");
      return;
    }

    navigate("/dashboard");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email.trim() === "" || password.trim() === "") {
      setMessage("Please enter Email and Password");
      return;
    }

    if (role === "") {
      setMessage("Please select a role");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await login({ email, password, role });
      const user = response.data;
      saveSession(user, user.teamId ? { teamId: user.teamId, teamName: user.teamName } : null);

      if (user.role === "TEAM_LEAD" && user.userId) {
        try {
          const teamResponse = await getTeamByLeaderId(user.userId);
          localStorage.setItem("team", JSON.stringify(teamResponse.data));
        } catch {
          if (user.teamId) {
            try {
              const teamResponse = await getTeamMemberTeam(user.userId);
              localStorage.setItem("team", JSON.stringify(teamResponse.data));
            } catch {
              // keep session data only
            }
          }
        }
      }

      if (source === "addproblem") {
        if (user.role === "ADMIN" || user.role === "EVENT_HEAD") {
          navigate("/add-problem");
          return;
        }

        setMessage("Only ADMIN or EVENT_HEAD can manage problem statements");
        return;
      }

      routeByRole(user.role);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Login failed";
      setMessage(typeof errorMessage === "string" ? errorMessage : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container-page">

      <h1 className="login-title">
        TS-MSME Portal Login
      </h1>

      <div className="login-box">

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Email / Phone"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />

          <select
            value={role}
            onChange={(e)=>setRole(e.target.value)}
          >
            <option value="">
              Please Select User Role
            </option>

            <option value="TEAM_LEAD">TEAM_LEAD</option>
            <option value="TEAM_MEMBER">TEAM_MEMBER</option>
            <option value="JUDGE">JUDGE</option>
            <option value="EVALUATOR">EVALUATOR</option>
            <option value="MENTOR">MENTOR</option>
            <option value="EVENT_HEAD">EVENT_HEAD</option>
            <option value="COLLEGE_SPOC">COLLEGE_SPOC</option>
            <option value="ADMIN">ADMIN</option>
          </select>

          {message && <p style={{ color: "#b00020", marginTop: 0 }}>{message}</p>}

          <p className="forgot">
            Forgot Your Password?
          </p>

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </button>

          <button
            type="button"
            className="submit-btn"
            style={{ marginTop: 12, background: "#0a6b63" }}
            onClick={() => navigate("/register-team-lead")}
          >
            Register as Team Leader
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;