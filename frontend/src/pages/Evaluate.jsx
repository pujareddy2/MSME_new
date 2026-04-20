import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getApplicationById, getApplications, getSubmissionViewUrl, submitEvaluation } from "../services/api";
import { callGemini } from "../utils/gemini";
import "./judging.css";

const EVALUATION_REQUIREMENTS = [
	"Problem understanding and relevance",
	"Solution feasibility",
	"Innovation and uniqueness",
	"Scalability and implementation clarity",
	"Presentation quality",
];

function Evaluate() {
	const { id } = useParams();
	const navigate = useNavigate();
	const location = useLocation();
	const [application, setApplication] = useState(null);
	const [loading, setLoading] = useState(true);
	const [aiLoading, setAiLoading] = useState(false);
	const [aiScore, setAiScore] = useState("");
	const [aiRemarks, setAiRemarks] = useState("");
	const [manualScore, setManualScore] = useState("");
	const [manualRemarks, setManualRemarks] = useState("");
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		let cancelled = false;

		const applyApp = (app) => {
			if (cancelled || !app) {
				return;
			}

			setApplication(app);
			setAiScore(app?.aiScore ?? "");
			setAiRemarks(app?.aiRemarks || "");
			setManualScore(app?.manualScore ?? "");
			setManualRemarks(app?.manualRemarks || "");
		};

		const resolveFallback = async () => {
			const response = await getApplications();
			const rows = response?.data || [];
			const numericId = Number(id);

			const normalized = rows.map((row, index) => ({
				row,
				index,
				applicationId: Number(row?.applicationId || row?.id),
				teamId: Number(row?.team?.teamId || row?.teamId),
				problemId: Number(row?.problem?.problemId || row?.problem?.id),
			}));

			const byApplicationId = normalized.find((item) => item.applicationId === numericId)?.row;
			if (byApplicationId) {
				return byApplicationId;
			}

			const byTeamId = normalized.find((item) => item.teamId === numericId)?.row;
			if (byTeamId) {
				return byTeamId;
			}

			const byProblemId = normalized.find((item) => item.problemId === numericId)?.row;
			if (byProblemId) {
				return byProblemId;
			}

			if (!Number.isNaN(numericId) && numericId > 0 && numericId <= rows.length) {
				return rows[numericId - 1];
			}

			return null;
		};

		const load = async () => {
			try {
				setLoading(true);

				const stateApp = location?.state?.application;
				if (stateApp && !cancelled) {
					applyApp(stateApp);
					return;
				}

				try {
					const response = await getApplicationById(id);
					applyApp(response.data);
				} catch {
					const fallback = await resolveFallback();
					if (fallback) {
						applyApp(fallback);
					} else if (!cancelled) {
						setApplication(null);
					}
				}
			} catch {
				if (!cancelled) {
					setApplication(null);
				}
			} finally {
				if (!cancelled) {
					setLoading(false);
				}
			}
		};

		load();

		return () => {
			cancelled = true;
		};
	}, [id, location?.state]);

	const isEvaluated = useMemo(() => {
		const status = (application?.submissionStatus || "").toLowerCase();
		return status === "evaluated" || status === "judged";
	}, [application]);

	const generateAiEvaluation = useCallback(async () => {
		if (!application) {
			return;
		}

		try {
			setAiLoading(true);
			const systemPrompt = "You are an expert innovation evaluator. Return valid JSON only with keys score and remarks. score must be 0-100.";
			const userMessage = [
				`Problem: ${application?.problem?.problemTitle || application?.problem?.title || "N/A"}`,
				`Abstract: ${application?.abstractText || ""}`,
				`Requirements: ${EVALUATION_REQUIREMENTS.join(", ")}`,
			].join("\n");

			const raw = await callGemini(systemPrompt, userMessage);
			const clean = raw.replace(/```json|```/g, "").trim();
			const parsed = JSON.parse(clean);

			const score = Number(parsed?.score);
			const bounded = Number.isNaN(score) ? "" : Math.max(0, Math.min(100, Math.round(score)));
			setAiScore(bounded);
			setAiRemarks(parsed?.remarks || "AI suggestion generated.");
		} catch (error) {
			const wordCount = (application?.abstractText || "").trim().split(/\s+/).filter(Boolean).length;
			setAiScore(Math.max(35, Math.min(95, Math.round((wordCount / 80) * 100))));
			setAiRemarks("AI assistant is unavailable. Fallback AI suggestion generated from abstract depth.");
			console.error(error);
		} finally {
			setAiLoading(false);
		}
	}, [application]);

	useEffect(() => {
		if (!application || isEvaluated) {
			return;
		}

		if ((application?.aiScore ?? null) !== null && (application?.aiRemarks || "").trim() !== "") {
			return;
		}

		generateAiEvaluation();
	}, [application, isEvaluated, generateAiEvaluation]);

	useEffect(() => {
		if (!loading && isEvaluated) {
			alert("Evaluation has already been completed for this application.");
		}
	}, [loading, isEvaluated]);

	const handleSubmitEvaluation = async () => {
		if (isEvaluated) {
			alert("This application is already evaluated.");
			return;
		}

		const ai = Number(aiScore);
		const manual = Number(manualScore);

		if (Number.isNaN(ai) || ai < 0 || ai > 100) {
			alert("AI score must be between 0 and 100.");
			return;
		}

		if ((aiRemarks || "").trim() === "") {
			alert("AI remarks are required.");
			return;
		}

		if (Number.isNaN(manual) || manual < 0 || manual > 100) {
			alert("Manual score must be between 0 and 100.");
			return;
		}

		if ((manualRemarks || "").trim() === "") {
			alert("Manual remarks are required.");
			return;
		}

		try {
			setSubmitting(true);
			await submitEvaluation(id, {
				aiScore: ai,
				aiRemarks,
				manualScore: manual,
				manualRemarks,
			});

			navigate("/evaluator", { state: { toast: "Evaluation submitted successfully" } });
		} catch (error) {
			const backendMessage = error?.response?.data?.message || error?.response?.data || "Unable to submit evaluation.";
			alert(typeof backendMessage === "string" ? backendMessage : "Unable to submit evaluation.");
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) {
		return <p style={{ padding: "40px" }}>Loading application...</p>;
	}

	if (!application) {
		return <p style={{ padding: "40px" }}>Application not found.</p>;
	}

	return (
		<div className="judge-page-wrap">
			<div className="judge-card">
				<h2 className="judge-card-title">Evaluator Workspace</h2>

				<div className="judge-section-box">
					<h4>Problem Statement</h4>
					<p>{application?.problem?.problemTitle || application?.problem?.title || "N/A"}</p>
				</div>

				<div className="judge-section-box">
					<h4>Evaluation Requirements</h4>
					<div className="requirements-mini-list">
						{EVALUATION_REQUIREMENTS.map((item) => (
							<span key={item} className="requirement-chip">{item}</span>
						))}
					</div>
				</div>

				<div className="judge-section-box">
					<h4>Abstract</h4>
					<p>{application.abstractText || "N/A"}</p>
				</div>

				<div className="judge-section-box">
					<h4>Submission</h4>
					<div className="ppt-actions-row">
						<button type="button" className="action-btn action-view" onClick={() => window.open(getSubmissionViewUrl(application.applicationId || application.id), "_blank")}>
							View Submission
						</button>
					</div>
					<iframe title="submission-preview" src={getSubmissionViewUrl(application.applicationId || application.id)} className="ppt-frame" />
				</div>

				<div className="judge-form-grid">
					<div className="judge-section-box judge-ai-box">
						<h4>AI Evaluator</h4>
						<button type="button" className="action-btn action-ai" disabled={isEvaluated || aiLoading} onClick={generateAiEvaluation}>
							{aiLoading ? "Generating AI Evaluation..." : "Generate AI Evaluation"}
						</button>
						<input className="judge-input" type="number" min="0" max="100" value={aiScore} readOnly placeholder="AI Score" />
						<textarea className="judge-textarea" value={aiRemarks} readOnly placeholder="AI Remarks" />
					</div>

					<div className="judge-section-box judge-manual-box">
						<h4>Manual Evaluator</h4>
						<input className="judge-input" type="number" min="0" max="100" value={manualScore} onChange={(event) => setManualScore(event.target.value)} disabled={isEvaluated} placeholder="Manual Score" />
						<textarea className="judge-textarea" value={manualRemarks} onChange={(event) => setManualRemarks(event.target.value)} disabled={isEvaluated} placeholder="Manual Remarks" />
					</div>
				</div>

				{isEvaluated && <p className="lock-note">Evaluation already completed. Duplicate evaluation is not allowed.</p>}

				<div className="judge-actions-row">
					<button className="action-btn action-view" onClick={() => navigate("/evaluator")}>Back to Dashboard</button>
					<button className="action-btn action-judge" disabled={isEvaluated || submitting} onClick={handleSubmitEvaluation}>
						{submitting ? "Submitting..." : "Submit Evaluation"}
					</button>
				</div>
			</div>
		</div>
	);
}

export default Evaluate;