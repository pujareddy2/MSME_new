import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { createApplication, getProblemById } from "../services/api";
import "./application.css";

function Application() {
  const navigate = useNavigate();
  const { id } = useParams();
  const currentRole = localStorage.getItem("role");

  const [solution, setSolution] = useState("");
  const [file, setFile] = useState(null);
  const [team, setTeam] = useState(null);
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (!id) {
      return;
    }

    getProblemById(id)
      .then((response) => setProblem(response.data))
      .catch(() => setProblem(null));
  }, [id]);

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
    if (currentRole !== "TEAM_LEAD") {
      alert("Only TEAM_LEAD can submit applications");
      return;
    }

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
      setLoading(true);

      const formData = new FormData();
      formData.append(
        "application",
        JSON.stringify({
          teamId: team.teamId,
          problemId: parseInt(id, 10),
          abstractText: solution.trim(),
          submissionVersion: "v1.0",
        })
      );
      formData.append("file", file);

      await createApplication(formData);

      alert("Application Submitted Successfully ✅");
      navigate("/my-applications");
    } catch (error) {
      console.error(error);
      const message =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Server Error ❌";
      alert(typeof message === "string" ? message : "Server Error ❌");
    } finally {
      setLoading(false);
    }
  };

  // ✅ SAFETY CHECKS BEFORE RENDER
  if (!id) {
    return <h2>Invalid Problem ID</h2>;
  }

  return (
    <div className="applicationPage">
      <h2 className="teamTitle">Application Form</h2>

      {problem && (
        <div className="teamInfoBox">
          <h3>Problem: {problem.problemTitle || problem.title}</h3>
          <p>{problem.problemDescription || problem.description}</p>
        </div>
      )}

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
      <button className="submitBtn" onClick={submitForm} disabled={loading}>
        {loading ? "Submitting..." : "Submit Application"}
      </button>
    </div>
  );
}

export default Application;