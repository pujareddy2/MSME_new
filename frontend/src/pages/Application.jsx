import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { createApplication, getProblemById, getTeamByLeaderId, getTeamMemberTeam } from "../services/api";
import { getStoredTeam, getStoredUser } from "../utils/session";
import "./application.css";

function Application() {
  const navigate = useNavigate();
  const { id } = useParams();
  const currentUser = getStoredUser();
  const currentRole = currentUser?.role || localStorage.getItem("role");

  const [solution, setSolution] = useState("");
  const [file, setFile] = useState(null);
  const [team, setTeam] = useState(null);
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [technologyStack, setTechnologyStack] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [demoLink, setDemoLink] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTeam = async () => {
      const savedTeam = getStoredTeam();
      if (savedTeam) {
        setTeam(savedTeam);
        return;
      }

      if (!currentUser?.userId) {
        return;
      }

      try {
        const teamResponse = currentRole === "TEAM_LEAD"
          ? await getTeamByLeaderId(currentUser.userId)
          : await getTeamMemberTeam(currentUser.userId);
        setTeam(teamResponse.data);
      } catch (loadError) {
        console.error(loadError);
      }
    }

    loadTeam();
  }, [currentUser?.userId, currentRole]);

  useEffect(() => {
    if (!id) {
      return;
    }

    getProblemById(id)
      .then((response) => setProblem(response.data))
      .catch(() => setProblem(null));
  }, [id]);

  const wordCount = useMemo(() => {
    return solution.trim().length === 0 ? 0 : solution.trim().split(/\s+/).length;
  }, [solution]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];

    if (!selected) return;

    const name = selected.name.toLowerCase();

    if (!name.endsWith(".ppt") && !name.endsWith(".pptx") && !name.endsWith(".pdf")) {
      alert("Only PPT, PPTX, or PDF files allowed");
      return;
    }

    if (selected.size > 20 * 1024 * 1024) {
      alert("File size must be 20MB or smaller");
      return;
    }

    setFile(selected);
  };

  const submitForm = async () => {
    if (currentRole !== "TEAM_LEAD") {
      alert("Only TEAM_LEAD can submit applications");
      return;
    }

    if (!currentUser?.userId) {
      navigate("/login");
      return;
    }

    if (!team) {
      alert("Please create a team first");
      navigate("/create-team");
      return;
    }

    if (wordCount < 200) {
      setError("Abstract must be at least 200 words");
      return;
    }

    if (!file) {
      setError("Upload PPT or PDF");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append(
        "application",
        JSON.stringify({
          teamId: team.teamId,
          problemId: parseInt(id, 10),
          abstractText: solution.trim(),
          submissionVersion: "v1.0",
          technologyStack: technologyStack.trim(),
          githubLink: githubLink.trim(),
          demoLink: demoLink.trim(),
        })
      );
      formData.append("file", file);

      await createApplication(formData);

      alert("Application Submitted Successfully ✅");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      const message =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Server Error ❌";
      setError(typeof message === "string" ? message : "Server Error ❌");
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
          <h3>Problem Details</h3>
          <p><strong>Problem ID:</strong> {problem.problemId || id}</p>
          <p><strong>Title:</strong> {problem.problemTitle || problem.title}</p>
          <p><strong>Organization:</strong> {problem.organizationName || problem.org || "Hackathon"}</p>
          <p><strong>Category:</strong> {problem.domain || problem.category}</p>
          <p><strong>Theme:</strong> {problem.difficultyLevel || problem.theme}</p>
        </div>
      )}

      {team ? (
        <div className="teamInfoBox">
          <h3>Team Overview</h3>
          <p><strong>Team Name:</strong> {team.teamName || "No Name"}</p>
          <p><strong>Team Leader:</strong> {currentUser?.name || "N/A"}</p>
          <p><strong>Team Members:</strong> {team.members ? team.members.length : 0}</p>
        </div>
      ) : (
        <p style={{ color: "red" }}>No team found. Please create a team first.</p>
      )}

      <div className="solutionBox">
        <h3>Idea Abstract / Solution Overview</h3>
        <textarea
          placeholder="Enter your solution overview"
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
        />
        <p>Word Count: {wordCount} / 6000</p>
      </div>

      <div className="solutionBox">
        <h3>Technology Stack</h3>
        <input
          type="text"
          placeholder="Python, TensorFlow, IoT Sensors"
          value={technologyStack}
          onChange={(e) => setTechnologyStack(e.target.value)}
        />
        <h3 style={{ marginTop: 18 }}>GitHub Repository Link</h3>
        <input
          type="url"
          placeholder="https://github.com/..."
          value={githubLink}
          onChange={(e) => setGithubLink(e.target.value)}
        />
        <h3 style={{ marginTop: 18 }}>Prototype Demo Link</h3>
        <input
          type="url"
          placeholder="Google Drive or YouTube link"
          value={demoLink}
          onChange={(e) => setDemoLink(e.target.value)}
        />
      </div>

      <div className="uploadWrapper">
        <h3>Upload Presentation</h3>
        <input type="file" accept=".ppt,.pptx,.pdf" onChange={handleFileChange} />
        {file && <p>{file.name} uploaded successfully.</p>}
      </div>

      {error && <p style={{ color: "#b00020" }}>{error}</p>}

      <button className="submitBtn" onClick={submitForm} disabled={loading}>
        {loading ? "Submitting..." : "Submit Application"}
      </button>
    </div>
  );
}

export default Application;