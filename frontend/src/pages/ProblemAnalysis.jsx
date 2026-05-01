import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./problemanalysis.css";

const BarChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>No data to display</p>;
  }

  const maxCount = Math.max(...data.map(d => d.submissionCount), 1);
  const barHeight = 200; // px

  return (
    <div className="bar-chart-wrapper">
      <div className="chart-y-title">Number of Submissions</div>
      <div className="bar-chart-container">
        <div className="chart-y-axis">
          <div>{Math.ceil(maxCount)}</div>
          <div>{Math.ceil(maxCount / 2)}</div>
          <div>0</div>
        </div>
        <div className="chart-bars">
          {data.map((item, idx) => (
            <div key={idx} className="bar-item">
              <div className="bar-wrapper">
                <div
                  className="bar"
                  style={{
                    height: `${(item.submissionCount / maxCount) * barHeight}px`,
                    background: `hsl(${200 + (idx % 10) * 15}, 70%, 50%)`,
                  }}
                  title={`${item.submissionCount} submissions`}
                >
                  <span className="bar-value">{item.submissionCount}</span>
                </div>
              </div>
              <div className="bar-label">{item.problemId}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="chart-x-title">Problem ID</div>
    </div>
  );
};

function ProblemAnalysis() {
  const navigate = useNavigate();
  const baseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

  const [summary, setSummary] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [problemsData, setProblemsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProblem, setSelectedProblem] = useState(null);

  useEffect(() => {
    loadAnalysisData();
  }, []);

  const loadAnalysisData = async () => {
    try {
      setLoading(true);
      const [summaryRes, chartRes, problemsRes] = await Promise.all([
        axios.get(`${baseURL}/analysis/summary`),
        axios.get(`${baseURL}/analysis/chart`),
        axios.get(`${baseURL}/analysis/problems`),
      ]);

      setSummary(summaryRes.data);
      setChartData(chartRes.data || []);
      setProblemsData(problemsRes.data || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load analysis data");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (problemId) => {
    try {
      const res = await axios.get(`${baseURL}/analysis/problem/${problemId}`);
      setSelectedProblem(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load problem details");
    }
  };

  if (loading) {
    return <div className="pa-container"><p>Loading analysis...</p></div>;
  }

  return (
    <div className="pa-container">
      <h1 className="pa-title">Problem Statement Analysis</h1>

      {/* Summary Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">Total Problem Statements</div>
          <div className="metric-value">{summary?.totalProblems || 0}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Total Submissions</div>
          <div className="metric-value">{summary?.totalSubmissions || 0}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Software Problems</div>
          <div className="metric-value">{summary?.softwareProblems || 0}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Hardware Problems</div>
          <div className="metric-value">{summary?.hardwareProblems || 0}</div>
        </div>
      </div>

      {/* Chart */}
      <div className="chart-section">
        <h2 className="section-title">Submissions by Problem</h2>
        <BarChart data={chartData} />
      </div>

      {/* Problems Table */}
      <div className="table-section">
        <h2 className="section-title">Problems Breakdown</h2>
        <table className="problems-table">
          <thead>
            <tr>
              <th>Problem ID</th>
              <th>Problem Title</th>
              <th>Type</th>
              <th>Submissions</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {problemsData.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No problems found
                </td>
              </tr>
            ) : (
              problemsData.map((problem, idx) => (
                <tr key={idx}>
                  <td>{problem.problemId}</td>
                  <td>{problem.problemTitle}</td>
                  <td>{problem.type}</td>
                  <td>{problem.submissionCount}</td>
                  <td>
                    <button
                      className="view-details-btn"
                      onClick={() => handleViewDetails(problem.problemId)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {selectedProblem && (
        <div className="modal-overlay" onClick={() => setSelectedProblem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedProblem.problem?.title}</h2>
              <button
                className="modal-close"
                onClick={() => setSelectedProblem(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h3>Problem Details</h3>
                <p>
                  <strong>ID:</strong> {selectedProblem.problem?.problemId}
                </p>
                <p>
                  <strong>Theme:</strong> {selectedProblem.problem?.theme}
                </p>
                <p>
                  <strong>Domain:</strong> {selectedProblem.problem?.domain}
                </p>
                <p>
                  <strong>Description:</strong>{" "}
                  {selectedProblem.problem?.description}
                </p>
              </div>

              <div className="detail-section">
                <h3>Applied Teams ({selectedProblem.totalApplications})</h3>
                {selectedProblem.appliedTeams?.length === 0 ? (
                  <p>No teams have applied yet</p>
                ) : (
                  <div className="teams-list">
                    {selectedProblem.appliedTeams?.map((team, idx) => (
                      <div key={idx} className="team-card">
                        <p>
                          <strong>Team:</strong> {team.teamName}
                        </p>
                        <p>
                          <strong>Leader:</strong> {team.teamLeader}
                        </p>
                        <p>
                          <strong>Abstract:</strong>{" "}
                          {team.abstract?.substring(0, 100)}...
                        </p>
                        <div className="team-links">
                          {team.githubLink && (
                            <a href={team.githubLink} target="_blank" rel="noreferrer">
                              GitHub
                            </a>
                          )}
                          {team.pptLink && (
                            <a href={team.pptLink} target="_blank" rel="noreferrer">
                              PPT
                            </a>
                          )}
                          {team.demoLink && (
                            <a href={team.demoLink} target="_blank" rel="noreferrer">
                              Demo
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default ProblemAnalysis;
