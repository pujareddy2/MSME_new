import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerTeamLeader } from "../services/api";
import { saveSession } from "../utils/session";
import "./login.css";

function RegisterTeamLeader() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    teamName: "",
    collegeId: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (form.password !== form.confirmPassword) {
      setMessage("Password confirmation must match");
      return;
    }

    try {
      setLoading(true);
      const response = await registerTeamLeader(form);
      saveSession(response.data);
      localStorage.setItem("pendingTeamName", form.teamName);
      setMessage("Registration completed. Continue with team creation.");
      navigate("/create-team");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || error?.response?.data || "Registration failed";
      setMessage(typeof errorMessage === "string" ? errorMessage : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container-page">
      <h1 className="login-title">Team Leader Registration</h1>
      <div className="login-box">
        <form onSubmit={handleSubmit}>
          <input placeholder="Team Leader Name" value={form.name} onChange={(e) => updateField("name", e.target.value)} />
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => updateField("email", e.target.value)} />
          <input placeholder="Phone" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} />
          <input type="password" placeholder="Password" value={form.password} onChange={(e) => updateField("password", e.target.value)} />
          <input type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={(e) => updateField("confirmPassword", e.target.value)} />
          <input placeholder="Team Name" value={form.teamName} onChange={(e) => updateField("teamName", e.target.value)} />
          <input placeholder="College ID (optional)" value={form.collegeId} onChange={(e) => updateField("collegeId", e.target.value)} />

          {message && <p style={{ color: "#b00020", marginTop: 0 }}>{message}</p>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterTeamLeader;