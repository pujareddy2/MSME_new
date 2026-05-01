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
      <h1 className="formTitle">Application Form</h1>

      {/* SECTION A: Problem Details - FULL WIDTH */}
      {problem && (
        <div className="form-section full-width">
          <h3 className="section-title">Problem Details</h3>
          <div className="problem-details-grid">
            <div className="detail-item">
              <label>Problem ID</label>
              <p>{problem.customProblemId || problem.problemId || id}</p>
            </div>
            <div className="detail-item">
              <label>Problem Title</label>
              <p>{problem.problemTitle || problem.title}</p>
            </div>
            <div className="detail-item">
              <label>Theme</label>
              <p>{problem.difficultyLevel || problem.theme || "General"}</p>
            </div>
          </div>
        </div>
      )}

      <div className="form-grid">
        {/* SECTION B: Team Overview - LEFT COLUMN */}
        {team ? (
          <div className="form-section left-column">
            <h3 className="section-title">Team Overview</h3>
            <div className="form-field">
              <label>Team Name</label>
              <p className="info-value">{team.teamName || "No Name"}</p>
            </div>
            <div className="form-field">
              <label>Team Leader</label>
              <p className="info-value">{currentUser?.name || "N/A"}</p>
            </div>
            <div className="form-field">
              <label>Team Members</label>
              <p className="info-value">{team.members ? team.members.length : 0}</p>
            </div>
          </div>
        ) : (
          <div className="form-section left-column">
            <p style={{ color: "red" }}>No team found. Please create a team first.</p>
          </div>
        )}

        {/* SECTION C: Idea & Abstract - RIGHT COLUMN */}
        <div className="form-section right-column">
          <h3 className="section-title">Idea & Abstract</h3>
          <div className="form-field">
            <label>Idea Description</label>
            <textarea
              className="form-textarea"
              placeholder="Enter your solution overview"
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              rows={10}
            />
            <div className="word-counter">Word Count: {wordCount} / 6000</div>
          </div>
        </div>
      </div>

      {/* SECTION D: Tech Stack + Links - GRID */}
      <div className="form-grid-2col">
        {/* LEFT: Technology Stack */}
        <div className="form-section">
          <h3 className="section-title">Technology Stack</h3>
          <div className="form-field">
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Python, TensorFlow, IoT Sensors"
              value={technologyStack}
              onChange={(e) => setTechnologyStack(e.target.value)}
            />
          </div>
        </div>

        {/* RIGHT: Links Section */}
        <div className="form-section">
          <h3 className="section-title">Project Links</h3>
          
          <div className="form-field">
            <label>GitHub Repository Link</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://github.com/..."
              value={githubLink}
              onChange={(e) => setGithubLink(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>Demo Link</label>
            <input
              type="url"
              className="form-input"
              placeholder="Google Drive or YouTube link"
              value={demoLink}
              onChange={(e) => setDemoLink(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* SECTION E: File Uploads */}
      <div className="form-section full-width">
        <h3 className="section-title">Upload Presentation</h3>
        <div className="form-field">
          <label>PPT / PDF File (Max 20MB)</label>
          <input 
            type="file" 
            className="form-file-input"
            accept=".ppt,.pptx,.pdf" 
            onChange={handleFileChange} 
          />
          {file && (
            <div className="file-uploaded">
              <strong>✓ {file.name}</strong> uploaded successfully
            </div>
          )}
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="form-actions">
        <button className="submitBtn" onClick={submitForm} disabled={loading}>
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </div>
    </div>
  );
}

export default Application;