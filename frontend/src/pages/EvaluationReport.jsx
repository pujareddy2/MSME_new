import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getApplicationById, getSubmissionViewUrl } from "../services/api";
import "./judging.css";

function EvaluationReport() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [application, setApplication] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getApplicationById(id)
			.then((response) => setApplication(response.data))
			.catch(() => setApplication(null))
			.finally(() => setLoading(false));
	}, [id]);

	const finalScore = useMemo(() => {
		const ai = application?.aiScore;
		const manual = application?.manualScore;
		if (ai === null || ai === undefined || manual === null || manual === undefined) {
			return null;
		}
		return Math.round((ai * 0.3 + manual * 0.7) * 100) / 100;
	}, [application]);

	if (loading) {
		return <p style={{ padding: "40px" }}>Loading report...</p>;
	}

	if (!application) {
		return <p style={{ padding: "40px" }}>Report not found.</p>;
	}

	return (
		<div className="judge-page-wrap">
			<div className="judge-card judge-report-card">
				<h2 className="judge-card-title">Evaluation Report</h2>

				<section className="judge-section-box">
					<h4>Team Details</h4>
					<p><b>Team Name:</b> {application.team?.teamName || "N/A"}</p>
					<p><b>Team ID:</b> {application.team?.teamId || application.teamId || "N/A"}</p>
				</section>

				<section className="judge-section-box">
					<h4>Problem Details</h4>
					<p><b>Problem Statement:</b> {application.problem?.problemTitle || application.problem?.title || "N/A"}</p>
					<p><b>Abstract:</b> {application.abstractText || "N/A"}</p>
				</section>

				<section className="judge-section-box report-score-grid">
					<h4>Evaluation Scores</h4>
					<p><b>AI Score:</b> <span className="score-ai">{application.aiScore ?? "-"}</span></p>
					<p><b>AI Remarks:</b> {application.aiRemarks || "N/A"}</p>
					<p><b>Manual Score:</b> <span className="score-manual">{application.manualScore ?? "-"}</span></p>
					<p><b>Manual Remarks:</b> {application.manualRemarks || "N/A"}</p>
					<p><b>Final Score:</b> {finalScore ?? "-"}</p>
				</section>

				<section className="judge-section-box">
					<h4>Submission</h4>
					<button type="button" className="action-btn action-view" onClick={() => window.open(getSubmissionViewUrl(application.applicationId || application.id), "_blank")}>
						View Submission
					</button>
				</section>

				<div className="judge-actions-row">
					<button className="action-btn action-view" onClick={() => navigate("/evaluator")}>Back to Dashboard</button>
				</div>
			</div>
		</div>
	);
}

export default EvaluationReport;
