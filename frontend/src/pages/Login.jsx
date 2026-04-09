import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./login.css";

function Login() {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const source = searchParams.get("source");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email.trim() === "" || password.trim() === "") {
      alert("Please enter Email and Password");
      return;
    }

    if (role === "") {
      alert("Please select a role");
      return;
    }

    // ✅ Store login info
    localStorage.setItem("userEmail", email);
    localStorage.setItem("role", role);

    if (source === "addproblem") {
      if (role === "ADMIN" || role === "EVENT_HEAD") {
        navigate("/add-problem");
        return;
      }

      alert("Only ADMIN or EVENT_HEAD can manage problem statements");
      return;
    }

    if (role === "JUDGE" || role === "EVALUATOR") {
      navigate("/evaluator");
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="login-container-page">

      <h1 className="login-title">
        TS-MSME Portal Login
      </h1>

      <div className="login-box">

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Email"
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

          <p className="forgot">
            Forgot Your Password?
          </p>

          <button
            type="submit"
            className="submit-btn"
          >
            Submit
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;