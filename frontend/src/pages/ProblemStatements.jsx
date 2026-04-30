import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import problemData from "../data/problemData";
import { createActivityLog, getApplications, getProblems } from "../services/api";
import { getStoredUser } from "../utils/session";
import ProblemDetailsModal from "../components/evaluation/ProblemDetailsModal";
import "./problemstatements.css";

function ProblemStatements() {
  const navigate = useNavigate();
  const currentUser = getStoredUser();

  const [categoryFilter, setCategoryFilter] = useState("");
  const [themeFilter, setThemeFilter] = useState("");
  const [entries, setEntries] = useState(10);
  const [search, setSearch] = useState("");
  const [applicationCounts, setApplicationCounts] = useState({});
  const [applications, setApplications] = useState([]);
  const [problems, setProblems] = useState(problemData);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setLoading(true);

        const [problemsResponse, applicationsResponse] = await Promise.all([
          getProblems().catch(() => null),
          getApplications().catch(() => null),
        ]);

        if (cancelled) {
          return;
        }

        const problemsData = problemsResponse?.data || [];
        if (Array.isArray(problemsData) && problemsData.length > 0) {
          setProblems(problemsData);
        } else {
          try {
            const storedProblems = JSON.parse(localStorage.getItem("addedProblems")) || [];
            setProblems([...problemData, ...storedProblems]);
          } catch {
            setProblems(problemData);
          }
        }

        const applicationsData = applicationsResponse?.data || [];
        setApplications(applicationsData);

        const counts = {};
        applicationsData.forEach((application) => {
          const problemId = application.problem?.problemId || application.problem?.id || application.problemId;
          if (problemId) {
            counts[problemId] = (counts[problemId] || 0) + 1;
          }
        });
        setApplicationCounts(counts);
      } catch (error) {
        console.error(error);
        setProblems(problemData);
        setApplications([]);
        setApplicationCounts({});
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

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const categoryValue = problem.category || problem.domain || "";
      const themeValue = problem.theme || problem.difficultyLevel || "";
      const searchTerm = search.toLowerCase();

      const matchesFilters =
        (categoryFilter === "" || categoryValue === categoryFilter) &&
        (themeFilter === "" || themeValue === themeFilter);

      const matchesSearch =
        (problem.title || problem.problemTitle || "").toLowerCase().includes(searchTerm) ||
        categoryValue.toLowerCase().includes(searchTerm) ||
        themeValue.toLowerCase().includes(searchTerm) ||
        (problem.organizationName || problem.org || "").toLowerCase().includes(searchTerm) ||
        (`PS${problem.id || problem.problemId}`).toLowerCase().includes(searchTerm);

      return matchesFilters && matchesSearch;
    });
  }, [problems, categoryFilter, themeFilter, search]);

  const chartData = useMemo(() => {
    return filteredProblems.map((problem) => {
      const problemId = problem.id || problem.problemId;
      return {
        id: problemId,
        name: problem.psNumber || `PS${problemId}`,
        title: problem.title || problem.problemTitle || `PS${problemId}`,
        submissions: applicationCounts[problemId] || 0,
      };
    });
  }, [filteredProblems, applicationCounts]);

  const visibleProblems = filteredProblems.slice(0, entries);

  const stats = useMemo(() => {
    const totalProblems = problems.length;
    const totalSubmissions = Object.values(applicationCounts).reduce((sum, value) => sum + value, 0);
    const activeProblems = filteredProblems.filter((problem) => (applicationCounts[problem.id || problem.problemId] || 0) > 0).length;

    return [
      { label: "Total Problem Statements", value: totalProblems, accent: "#0f766e" },
      { label: "Total Submissions", value: totalSubmissions, accent: "#2563eb" },
      { label: "Active Problem Statements", value: activeProblems, accent: "#7c3aed" },
    ];
  }, [problems.length, applicationCounts, filteredProblems]);

  const submissionSummary = useMemo(() => {
    const highest = chartData.reduce((best, item) => (item.submissions > best.submissions ? item : best), { submissions: -1 });
    return highest.submissions >= 0 ? highest : null;
  }, [chartData]);

  const openProblemDetails = (problem) => {
    const problemId = problem.id || problem.problemId;
    const title = problem.title || problem.problemTitle || `PS${problemId}`;

    if (currentUser?.role === "TEAM_LEAD" && currentUser?.userId) {
      createActivityLog({
        userId: currentUser.userId,
        message: `Problem selected: ${title}`,
      }).catch(() => undefined);
    }

    setSelectedProblem(problem);
    setModalOpen(true);
  };

  const selectedProblemApplications = useMemo(() => {
    if (!selectedProblem) {
      return [];
    }

    const selectedProblemId = selectedProblem.id || selectedProblem.problemId;
    return applications.filter((application) => {
      const applicationProblemId = application.problem?.problemId || application.problem?.id || application.problemId;
      return String(applicationProblemId) === String(selectedProblemId);
    });
  }, [selectedProblem, applications]);

  return (
    <div className="ps-page ps-analytics-page">
      <div className="ps-header-row">
        <div>
          <p className="ps-eyebrow">Evaluation Control Center</p>
          <h1 className="ps-title">Problem Statements</h1>
          <p className="ps-subtitle">Track total submissions, inspect each problem, and open the full submission breakdown from one place.</p>
        </div>

        <div className="top-actions">
          <button className="template-btn analytics-btn" onClick={() => navigate("/evaluator")}>Evaluator Dashboard</button>
          <button className="add-problem-btn analytics-btn" onClick={() => navigate("/judge-dashboard")}>Judge Dashboard</button>
        </div>
      </div>

      <div className="summary-strip">
        {stats.map((stat) => (
          <article key={stat.label} className="summary-metric-card" style={{ borderColor: stat.accent }}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </div>

      <div className="analytics-panel">
        <div className="analytics-panel-head">
          <div>
            <h2>Submission Analytics</h2>
            <p>X-axis: Problem Statement, Y-axis: Number of Submissions</p>
          </div>
          {submissionSummary && (
            <div className="analytics-highlight">
              <span>Most active problem</span>
              <strong>{submissionSummary.title}</strong>
              <small>{submissionSummary.submissions} submissions</small>
            </div>
          )}
        </div>

        <div className="chart-shell">
          {loading ? (
            <p className="workspace-empty-state">Loading analytics...</p>
          ) : chartData.length === 0 ? (
            <p className="workspace-empty-state">No problem statements available for analytics.</p>
          ) : (
            <div className="simple-bar-chart">
              <div style={{ display: "flex", gap: "16px", overflowX: "auto", paddingBottom: "10px", alignItems: "flex-end", minHeight: "300px" }}>
                {chartData.slice(0, 15).map((item, index) => {
                  const maxSubmissions = Math.max(...chartData.map(d => d.submissions), 1);
                  const barHeight = (item.submissions / maxSubmissions) * 280;
                  return (
                    <div key={item.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "80px" }}>
                      <div
                        style={{
                          width: "60px",
                          height: `${barHeight}px`,
                          background: `linear-gradient(180deg, #0f766e 0%, #2563eb 100%)`,
                          borderRadius: "8px 8px 0 0",
                          marginBottom: "8px",
                          transition: "all 0.3s ease",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                        title={`${item.title}: ${item.submissions} submissions`}
                      />
                      <div style={{ fontSize: "11px", color: "#58707e", maxWidth: "75px", whiteSpace: "normal", textAlign: "center", lineHeight: "1.2" }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: "12px", fontWeight: 600, color: "#0f2f3f", marginTop: "4px" }}>
                        {item.submissions}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ color: "#58707e", fontSize: "12px", marginTop: "12px", textAlign: "center" }}>
                Showing {Math.min(15, chartData.length)} of {chartData.length} problems
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="table-controls">
        <div className="controls-left">
          <div className="control-inline entries-box">
            <label htmlFor="entries-select">Show</label>
            <select id="entries-select" value={entries} onChange={(e) => setEntries(Number(e.target.value))}>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>entries</span>
          </div>

          <div className="control-inline filter-box">
            <label htmlFor="category-filter">Category</label>
            <select id="category-filter" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="">All</option>
              <option value="Software">Software</option>
              <option value="Hardware">Hardware</option>
              <option value="Miscellaneous">Miscellaneous</option>
            </select>
          </div>

          <div className="control-inline filter-box">
            <label htmlFor="theme-filter">Theme</label>
            <select id="theme-filter" value={themeFilter} onChange={(e) => setThemeFilter(e.target.value)}>
              <option value="">All</option>
              <option value="Artificial Intelligence">Artificial Intelligence</option>
              <option value="Smart Education">Smart Education</option>
              <option value="Health Tech">Health Tech</option>
              <option value="Agriculture">Agriculture</option>
              <option value="Sustainable Development">Sustainable Development</option>
            </select>
          </div>
        </div>

        <div className="control-inline search-box">
          <label htmlFor="problem-search">Search</label>
          <input
            id="problem-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, organization, category, PS number"
          />
        </div>
      </div>

      <div className="table-container">
        <table className="ps-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Problem Statement ID</th>
              <th>Problem Statement</th>
              <th>Sector</th>
              <th>Submitted Ideas Count</th>
              <th>Team Capacity</th>
              <th>Submission Deadline</th>
              <th>Details</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="workspace-empty-state">Loading problems...</td>
              </tr>
            ) : visibleProblems.length === 0 ? (
              <tr>
                <td colSpan="8" className="workspace-empty-state">No problem statements match your filters.</td>
              </tr>
            ) : (
              visibleProblems.map((problem, index) => {
                const problemId = problem.id || problem.problemId;
                const maxSubmissions = problem.maxSubmissions || problem.max || 300;
                const submissionCount = applicationCounts[problemId] || problem.submissions || 0;

                return (
                  <tr key={problemId}>
                    <td>{index + 1}</td>
                    <td>{problem.psNumber || `PS${problemId}`}</td>
                    <td className="problem-link" onClick={() => openProblemDetails(problem)}>
                      <strong>{problem.title || problem.problemTitle}</strong>
                      <span>{problem.organizationName || problem.org || "Hackathon"}</span>
                    </td>
                    <td>{problem.category || problem.domain || problem.theme || "General"}</td>
                    <td>
                      <span className="submission-count-pill">{submissionCount} / {maxSubmissions}</span>
                    </td>
                    <td>Team Size: 6</td>
                    <td>{problem.deadline || problem.submissionDeadline || "Open"}</td>
                    <td>
                      <button className="view-btn" onClick={() => openProblemDetails(problem)}>View Details</button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <ProblemDetailsModal
        open={modalOpen}
        problem={selectedProblem}
        applications={selectedProblemApplications}
        onClose={() => {
          setModalOpen(false);
          setSelectedProblem(null);
        }}
      />
    </div>
  );
}

export default ProblemStatements;