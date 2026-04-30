import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApplications, getProblems } from "../services/api";
import { getStoredUser } from "../utils/session";
import "./problemstatements.css";

function ProblemStatements() {
  const navigate = useNavigate();
  const currentUser = getStoredUser();
  const [problems, setProblems] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [activePanel, setActivePanel] = useState("");
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [aiSelected, setAiSelected] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setLoading(true);
        const [problemsResponse, applicationsResponse] = await Promise.all([
          getProblems(),
          getApplications(),
        ]);
        if (!cancelled) {
          setProblems(Array.isArray(problemsResponse?.data) ? problemsResponse.data : []);
          setApplications(Array.isArray(applicationsResponse?.data) ? applicationsResponse.data : []);
        }
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          setProblems([]);
          setApplications([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  const submissionCountByProblem = useMemo(() => {
    const counts = {};
    applications.forEach((application) => {
      const problemId = application.problem?.problemId || application.problemId;
      if (problemId) {
        counts[problemId] = (counts[problemId] || 0) + 1;
      }
    });
    return counts;
  }, [applications]);

  const filteredProblems = useMemo(() => {
    const term = search.trim().toLowerCase();
    return problems.filter((problem) => {
      if (!term) return true;
      const id = String(problem.problemId || "");
      const title = String(problem.problemTitle || "").toLowerCase();
      const theme = String(problem.theme || "").toLowerCase();
      const domain = String(problem.domain || "").toLowerCase();
      return id.includes(term) || title.includes(term) || theme.includes(term) || domain.includes(term);
    });
  }, [problems, search]);

  const visibleProblems = useMemo(() => filteredProblems.slice(0, entries), [filteredProblems, entries]);

  const activeProblems = useMemo(
    () => problems.filter((problem) => (problem.status || "ACTIVE").toUpperCase() === "ACTIVE"),
    [problems]
  );

  const inactiveProblems = useMemo(
    () => problems.filter((problem) => (problem.status || "ACTIVE").toUpperCase() !== "ACTIVE"),
    [problems]
  );

  const handleApply = (problemId) => {
    if (!currentUser?.userId) {
      navigate("/login");
      return;
    }

    if (currentUser.role !== "TEAM_LEAD") {
      alert("Only Team Leaders can apply");
      navigate("/login");
      return;
    }

    navigate(`/apply/${problemId}`);
  };

  const formatMultilineDescription = (description) => {
    const text = (description || "").trim();
    if (!text) {
      return "No description available.";
    }
    const words = text.split(/\s+/);
    const lines = [];
    const chunkSize = Math.max(5, Math.ceil(words.length / 15));
    for (let i = 0; i < words.length; i += chunkSize) {
      lines.push(words.slice(i, i + chunkSize).join(" "));
    }
    return lines.join("\n");
  };

  return (
    <div className="ps-page">
      <div className="ps-top-box">
        <h1 className="ps-title">Problem Statements</h1>
        <div className="ps-top-actions">
          <button className="primary-btn" onClick={() => navigate("/add-problem")}>Add Problem Statement</button>
          <button className="secondary-btn" onClick={() => setAiPanelOpen(true)}>AI-Based Automations</button>
        </div>
        <div className="stats-row">
          <button className="stat-card clickable" onClick={() => setActivePanel("problems")}>
            <span>Total Problem Statements</span>
            <strong>{problems.length}</strong>
          </button>
          <button className="stat-card clickable" onClick={() => setActivePanel("submissions")}>
            <span>Total Submissions</span>
            <strong>{applications.length}</strong>
          </button>
        </div>
      </div>

      <div className="table-controls">
        <select value={entries} onChange={(e) => setEntries(Number(e.target.value))}>
          <option value={10}>Show 10</option>
          <option value={25}>Show 25</option>
          <option value={50}>Show 50</option>
        </select>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by id, title, theme, sector"
        />
      </div>

      <div className="table-container">
        <table className="ps-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Problem ID</th>
              <th>Problem Statement</th>
              <th>Theme</th>
              <th>Sector</th>
              <th>Submissions</th>
              <th>Team Note</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8">Loading problems...</td></tr>
            ) : visibleProblems.length === 0 ? (
              <tr><td colSpan="8">No problem statements found.</td></tr>
            ) : (
              visibleProblems.map((problem, index) => (
                <tr key={problem.problemId}>
                  <td>{index + 1}</td>
                  <td>{problem.problemId}</td>
                  <td>
                    <strong>{problem.problemTitle}</strong>
                    <div className="muted">{problem.status || "ACTIVE"}</div>
                  </td>
                  <td>{problem.theme || "General"}</td>
                  <td>{problem.domain || "General"}</td>
                  <td>{submissionCountByProblem[problem.problemId] || 0}</td>
                  <td>Team size: Maximum 6 members</td>
                  <td>
                    <button className="action-btn" onClick={() => handleApply(problem.problemId)}>Apply</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {activePanel && (
        <div className="overlay" onClick={() => setActivePanel("")}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>{activePanel === "problems" ? "Problem Statement Breakdown" : "Problem-wise Submission Count"}</h3>
            {activePanel === "problems" ? (
              <>
                <p><strong>Active Problems:</strong> {activeProblems.length}</p>
                <p><strong>Inactive Problems:</strong> {inactiveProblems.length}</p>
              </>
            ) : (
              <div className="list-block">
                {problems.map((problem) => (
                  <div key={problem.problemId} className="list-item">
                    <span>{problem.problemTitle}</span>
                    <strong>{submissionCountByProblem[problem.problemId] || 0}</strong>
                  </div>
                ))}
              </div>
            )}
            <button className="secondary-btn" onClick={() => setActivePanel("")}>Close</button>
          </div>
        </div>
      )}

      {aiPanelOpen && (
        <div className="overlay" onClick={() => setAiPanelOpen(false)}>
          <div className="modal-card wide" onClick={(e) => e.stopPropagation()}>
            <h3>Previous Problem Statements</h3>
            <div className="ai-list">
              {problems.map((problem) => (
                <button key={problem.problemId} className="ai-item" onClick={() => setAiSelected(problem)}>
                  <div><strong>Problem ID:</strong> {problem.problemId}</div>
                  <div><strong>Title:</strong> {problem.problemTitle}</div>
                  <div><strong>Theme:</strong> {problem.theme || "General"}</div>
                  <pre>{formatMultilineDescription(problem.problemDescription)}</pre>
                </button>
              ))}
            </div>
            <button className="secondary-btn" onClick={() => setAiPanelOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {aiSelected && (
        <div className="overlay" onClick={() => setAiSelected(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>{aiSelected.problemTitle}</h3>
            <p><strong>Problem ID:</strong> {aiSelected.problemId}</p>
            <p><strong>Theme:</strong> {aiSelected.theme || "General"}</p>
            <p><strong>Sector:</strong> {aiSelected.domain || "General"}</p>
            <p><strong>Status:</strong> {aiSelected.status || "ACTIVE"}</p>
            <div className="description-box">{aiSelected.problemDescription || "No description available."}</div>
            <button className="secondary-btn" onClick={() => setAiSelected(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProblemStatements;
