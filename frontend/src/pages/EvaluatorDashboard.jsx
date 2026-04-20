import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getApplications } from "../services/api";
import "./judging.css";

const EVALUATION_REQUIREMENTS = [
	"Problem understanding and relevance",
	"Solution feasibility",
	"Innovation and uniqueness",
	"Scalability and implementation clarity",
	"Presentation quality",
];

function EvaluatorDashboard() {
	const navigate = useNavigate();
	const location = useLocation();
	const [submissions, setSubmissions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState("all");
	const [toastMessage, setToastMessage] = useState(location.state?.toast || "");

	const currentRole = localStorage.getItem("role");
	const isAllowed = currentRole === "EVALUATOR";

	const normalizeSubmission = useCallback((app) => {
		const statusText = (app?.submissionStatus || "").toLowerCase();
		const isEvaluated = statusText === "evaluated" || statusText === "judged";

		return {
			id: app?.applicationId || app?.id,
			problemId: app?.problem?.problemId || app?.problem?.id || "N/A",
			problemStatement: app?.problem?.problemTitle || app?.problem?.title || "N/A",
			teamName: app?.team?.teamName || "N/A",
			leader: app?.team?.leader?.fullName || "N/A",
			aiScore: app?.aiScore ?? "-",
			manualScore: app?.manualScore ?? "-",
			status: isEvaluated ? "Evaluated" : "Pending",
		};
	}, []);

	const loadApplications = useCallback(async () => {
		try {
			setLoading(true);
			const response = await getApplications();
			setSubmissions((response.data || []).map(normalizeSubmission));
		} catch (error) {
			console.error(error);
			setSubmissions([]);
		} finally {
			setLoading(false);
		}
	}, [normalizeSubmission]);

	useEffect(() => {
		loadApplications();
	}, [loadApplications]);

	useEffect(() => {
		if (!toastMessage) {
			return;
		}

		const timer = setTimeout(() => {
			setToastMessage("");
			navigate(location.pathname, { replace: true, state: {} });
		}, 2800);

		return () => clearTimeout(timer);
	}, [toastMessage, navigate, location.pathname]);

	const filteredSubmissions = useMemo(() => {
		if (filter === "pending") {
			return submissions.filter((submission) => submission.status === "Pending");
		}
		if (filter === "evaluated") {
			return submissions.filter((submission) => submission.status === "Evaluated");
		}
		return submissions;
	}, [filter, submissions]);

	if (!isAllowed) {
		return <p style={{ padding: "80px" }}>Evaluator access only.</p>;
	}

	return (
		<div className="judging-dashboard-container">
			<div className="judging-dashboard-head">
				<div className="judging-title-block">
					<h2 className="judging-page-title">TS-Hackathon Evaluation Dashboard</h2>
					<p className="judging-page-subtitle">Review submitted problem statements with evaluation requirements before judging handoff.</p>
				</div>

				<div className="judging-toolbar">
					<select className="judging-filter" value={filter} onChange={(event) => setFilter(event.target.value)}>
						<option value="all">All</option>
						<option value="pending">Pending</option>
						<option value="evaluated">Evaluated</option>
					</select>
					<button type="button" className="judging-refresh-btn" onClick={loadApplications}>Refresh</button>
				</div>
			</div>

			{toastMessage && <div className="judging-toast">{toastMessage}</div>}

			<div className="judging-table-shell">
				<div className="judging-table-wrap">
					<table className="judging-table">
						<thead>
							<tr>
								<th>Problem ID</th>
								<th>Problem Statement</th>
								<th>Team</th>
								<th>Requirements</th>
								<th>Status</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{loading ? (
								<tr><td colSpan="6">Loading submissions...</td></tr>
							) : filteredSubmissions.length === 0 ? (
								<tr><td colSpan="6">No submissions found.</td></tr>
							) : (
								filteredSubmissions.map((submission) => {
									const isEvaluated = submission.status === "Evaluated" || submission.status === "Judged";
									return (
										<tr key={submission.id}>
											<td>{submission.problemId}</td>
											<td>{submission.problemStatement}</td>
											<td>{submission.teamName}</td>
											<td>
												<div className="requirements-mini-list">
													{EVALUATION_REQUIREMENTS.map((item) => (
														<span key={`${submission.id}-${item}`} className="requirement-chip">{item}</span>
													))}
												</div>
											</td>
											<td>
												<span className={`status-badge ${isEvaluated ? "status-judged" : "status-pending"}`}>
													{submission.status}
												</span>
											</td>
											<td className="judging-actions-cell">
												{!isEvaluated ? (
													<button className="action-btn action-judge" onClick={() => navigate(`/evaluate/${submission.id}`)}>Evaluate</button>
												) : (
													<>
														<button className="action-btn action-evaluated" onClick={() => alert("This application is already evaluated.")}>Evaluated</button>
														<button className="action-btn action-report" onClick={() => navigate(`/evaluation-report/${submission.id}`)}>View Report</button>
													</>
												)}
											</td>
										</tr>
									);
								})
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

export default EvaluatorDashboard;