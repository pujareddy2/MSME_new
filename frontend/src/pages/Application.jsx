import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "./application.css";

function Application() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [solution, setSolution] = useState("");
  const [file, setFile] = useState(null);
  const [team, setTeam] = useState(null);

  // Load team safely
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
        console.error("Invalid team data", e);
      }
    }
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];

    if (!selected) return;

    const name = selected.name.toLowerCase();

    if (!name.endsWith(".ppt") && !name.endsWith(".pptx")) {
      alert("Only PPT or PPTX files allowed");
      return;
    }

    setFile(selected);
  };

  const submitForm = async () => {
    if (!team) {
      alert("Please create a team first");
      return;
    }

    if (solution.trim() === "") {
      alert("Please enter Abstract");
      return;
    }

    if (!file) {
      alert("Upload PPT");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          abstractText: solution,
          submissionVersion: "v1.0",
          team: {
            teamId: team.teamId || 1,
          },
          problem: {
            problemId: parseInt(id),
          },
        }),
      });

      if (response.ok) {
        alert("Application Submitted Successfully ✅");
        navigate("/my-applications");
      } else {
        alert("Submission Failed ❌");
      }
    } catch (error) {
      console.error(error);
      alert("Server Error ❌");
    }
  };

  // ✅ SAFETY CHECKS BEFORE RENDER
  if (!id) {
    return <h2>Invalid Problem ID</h2>;
  }

  return (
    <div className="applicationPage">
      <h2 className="teamTitle">Application Form</h2>

      {/* TEAM INFO */}
      {team ? (
        <div className="teamInfoBox">
          <h3>Selected Team: {team.teamName || "No Name"}</h3>
          <p>Total Members: {team.members ? team.members.length : 0}</p>
        </div>
      ) : (
        <p style={{ color: "red" }}>
          No team found. Please create a team first.
        </p>
      )}

      {/* ABSTRACT */}
      <div className="solutionBox">
        <h3>Abstract</h3>

        <textarea
          placeholder="Enter Abstract"
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
        />
      </div>

      {/* FILE UPLOAD */}
      <div className="uploadWrapper">
        <h3>Upload PPT</h3>

        <input type="file" accept=".ppt,.pptx" onChange={handleFileChange} />

        {file && <p>Selected: {file.name}</p>}
      </div>

      {/* SUBMIT */}
      <button className="submitBtn" onClick={submitForm}>
        Submit Application
      </button>
    </div>
  );
}

export default Application;