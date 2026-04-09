import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./application.css";

function CreateTeam() {
  const [teamName, setTeamName] = useState("");
  const navigate = useNavigate();
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

  const addMember = () => {
    if (members.length >= 5) {
      alert("Maximum 5 Members Allowed");
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
    temp[index][field] = value;
    setMembers(temp);
  };

  const allMembersFilled = () => {
    for (let m of members) {
      if (
        m.name.trim() === "" ||
        m.email.trim() === "" ||
        m.mobile.trim() === "" ||
        m.gender === "" ||
        m.college.trim() === "" ||
        m.course.trim() === "" ||
        m.rollno.trim() === ""
      ) {
        return false;
      }
    }
    return true;
  };

  // ✅ UPDATED FUNCTION (BACKEND CONNECTED)
  const submitTeam = async () => {
    if (teamName.trim() === "") {
      alert("Enter Team Name");
      return;
    }

    if (!allMembersFilled()) {
      alert("Fill all member details");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teamName: teamName,
          members: members,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save team");
      }

      const data = await response.json();

      // ✅ SAVE REAL TEAM (WITH teamId)
      localStorage.setItem("team", JSON.stringify(data));

      alert("Team Created Successfully ✅");

      navigate("/dashboard");

    } catch (error) {
      console.error(error);
      alert("Error saving team ❌");
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
                  onChange={(e) =>
                    handleChange(index, "mobile", e.target.value)
                  }
                />
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

      <button className="addBtn" onClick={addMember}>
        + Add Member
      </button>

      <button className="submitBtn" onClick={submitTeam}>
        Save Team
      </button>
    </div>
  );
}

export default CreateTeam;