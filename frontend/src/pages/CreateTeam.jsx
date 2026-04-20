import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { createTeam } from "../services/api";
import { getStoredTeam, getStoredUser, saveSession } from "../utils/session";
import "./application.css";

function CreateTeam() {
  const MAX_MEMBERS = 5; // Includes team leader column.
  const [teamName, setTeamName] = useState("");
  const navigate = useNavigate();
  const currentRole = localStorage.getItem("role");
  const currentUser = getStoredUser();
  const [members, setMembers] = useState([
    {
      name: "",
      email: "",
      mobile: "",
      gender: "",
      college: "",
      course: "",
      rollno: "",
    },
  ]);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const normalizeMobile = (value) => {
    let digits = value.replace(/\D/g, "");

    // Strip common country/area prefixes instead of accepting them as-is.
    if (digits.length === 12 && digits.startsWith("91")) {
      digits = digits.slice(2);
    }
    if (digits.length === 11 && digits.startsWith("0")) {
      digits = digits.slice(1);
    }

    return digits.slice(0, 10);
  };

  const memberEmailError = (member) => {
    if (member.email.trim() === "") {
      return "Email is required.";
    }
    if (!isValidEmail(member.email)) {
      return "Enter a valid email (example@domain.com).";
    }
    return "";
  };

  const memberMobileError = (member) => {
    if (member.mobile.trim() === "") {
      return "Mobile number is required.";
    }
    if (!/^\d{10}$/.test(member.mobile.trim())) {
      return "Enter a valid 10-digit mobile number.";
    }
    return "";
  };

  useEffect(() => {
    const storedTeam = getStoredTeam();
    const pendingTeamName = localStorage.getItem("pendingTeamName");

    if (pendingTeamName && !teamName) {
      setTeamName(pendingTeamName);
    }

    if (storedTeam && storedTeam.teamName && !teamName) {
      setTeamName(storedTeam.teamName);
    }
  }, [teamName]);

  const addMember = () => {
    if (members.length >= MAX_MEMBERS) {
      return;
    }

    setMembers([
      ...members,
      {
        name: "",
        email: "",
        mobile: "",
        gender: "",
        college: "",
        course: "",
        rollno: "",
      },
    ]);
  };

  const handleChange = (index, field, value) => {
    const temp = [...members];
    temp[index][field] = field === "mobile" ? normalizeMobile(value) : value;
    setMembers(temp);
  };

  const allMembersFilled = () => {
    for (let m of members) {
      if (
        m.name.trim() === "" ||
        m.email.trim() === "" ||
        m.mobile.trim() === "" ||
        m.gender === ""
      ) {
        return false;
      }
    }
    return true;
  };

  const hasDuplicateMembers = () => {
    const emails = new Set();
    const rollNumbers = new Set();

    for (const member of members) {
      const email = member.email.trim().toLowerCase();
      const rollNumber = member.rollno.trim().toLowerCase();

      if (emails.has(email) || (rollNumber !== "" && rollNumbers.has(rollNumber))) {
        return true;
      }

      emails.add(email);
      if (rollNumber !== "") {
        rollNumbers.add(rollNumber);
      }
    }

    return false;
  };

  // ✅ UPDATED FUNCTION (BACKEND CONNECTED)
  const submitTeam = async () => {
    if (currentRole !== "TEAM_LEAD") {
      alert("Only TEAM_LEAD can create a team");
      return;
    }

    if (!currentUser?.userId) {
      alert("Please login again to continue");
      navigate("/login");
      return;
    }

    if (teamName.trim() === "") {
      alert("Enter Team Name");
      return;
    }

    if (!allMembersFilled()) {
      alert("Fill required member details (Name, Email, Mobile, Gender).");
      return;
    }

    const invalidEmail = members.some((member) => memberEmailError(member) !== "");
    if (invalidEmail) {
      alert("Please correct invalid email format.");
      return;
    }

    const invalidMobile = members.some((member) => memberMobileError(member) !== "");
    if (invalidMobile) {
      alert("Please correct invalid mobile numbers.");
      return;
    }

    if (hasDuplicateMembers()) {
      alert("Duplicate team member email or roll number found");
      return;
    }

    try {
      const response = await createTeam({
        leaderId: currentUser.userId,
        teamName: teamName.trim(),
        members,
      });

      const data = response.data;

      // ✅ SAVE REAL TEAM (WITH teamId)
      saveSession(currentUser, data);
      localStorage.removeItem("pendingTeamName");

      alert("Team Created Successfully ✅");

      navigate("/dashboard");

    } catch (error) {
      console.error(error);
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        error?.response?.data?.error ||
        error?.message ||
        "Error saving team ❌";

      alert(backendMessage);
    }
  };

  return (
    <div className="applicationPage">
      <h2 className="teamTitle">Create Team</h2>

      {/* TEAM NAME */}
      <div className="teamNameRow">
        <label>Team Name</label>
        <input
          type="text"
          placeholder="Enter Team Name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />
      </div>

      {/* MEMBERS TABLE */}
      <table className="teamTable">
        <thead>
          <tr>
            <th>Field</th>
            {members.map((m, index) => (
              <th key={index}>
                {index === 0 ? "Leader" : "Member " + (index + 1)}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Name</td>
            {members.map((m, index) => (
              <td key={index}>
                <input
                  placeholder="Full Name"
                  value={m.name}
                  onChange={(e) =>
                    handleChange(index, "name", e.target.value)
                  }
                />
              </td>
            ))}
          </tr>

          <tr>
            <td>Email</td>
            {members.map((m, index) => (
              <td key={index}>
                <input
                  placeholder="Email"
                  value={m.email}
                  onChange={(e) =>
                    handleChange(index, "email", e.target.value)
                  }
                />
                {memberEmailError(m) && (
                  <div className="inlineError">{memberEmailError(m)}</div>
                )}
              </td>
            ))}
          </tr>

          <tr>
            <td>Mobile</td>
            {members.map((m, index) => (
              <td key={index}>
                <input
                  placeholder="Mobile"
                  value={m.mobile}
                  inputMode="numeric"
                  onChange={(e) =>
                    handleChange(index, "mobile", e.target.value)
                  }
                />
                {memberMobileError(m) && (
                  <div className="inlineError">{memberMobileError(m)}</div>
                )}
              </td>
            ))}
          </tr>

          <tr>
            <td>Gender</td>
            {members.map((m, index) => (
              <td key={index}>
                <select
                  value={m.gender}
                  onChange={(e) =>
                    handleChange(index, "gender", e.target.value)
                  }
                >
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </td>
            ))}
          </tr>

          <tr>
            <td>College</td>
            {members.map((m, index) => (
              <td key={index}>
                <input
                  placeholder="College"
                  value={m.college}
                  onChange={(e) =>
                    handleChange(index, "college", e.target.value)
                  }
                />
              </td>
            ))}
          </tr>

          <tr>
            <td>Course</td>
            {members.map((m, index) => (
              <td key={index}>
                <input
                  placeholder="Course"
                  value={m.course}
                  onChange={(e) =>
                    handleChange(index, "course", e.target.value)
                  }
                />
              </td>
            ))}
          </tr>

          <tr>
            <td>Roll No</td>
            {members.map((m, index) => (
              <td key={index}>
                <input
                  placeholder="Roll Number"
                  value={m.rollno}
                  onChange={(e) =>
                    handleChange(index, "rollno", e.target.value)
                  }
                />
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      <div className="teamActionRow">
        <button className="addBtn" onClick={addMember} disabled={members.length >= MAX_MEMBERS}>
          + Add Member
        </button>

        <button className="submitBtn" onClick={submitTeam}>
          Save Team
        </button>
      </div>

      {members.length >= MAX_MEMBERS && (
        <p className="memberLimitMsg">Maximum 5 members reached (including leader).</p>
      )}
    </div>
  );
}

export default CreateTeam;