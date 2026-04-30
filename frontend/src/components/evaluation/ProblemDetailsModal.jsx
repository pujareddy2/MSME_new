function ProblemDetailsModal({ open, problem, applications = [], onClose }) {
  if (!open || !problem) {
    return null;
  }

  const problemId = problem.id || problem.problemId;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="problem-modal-title">
      <div className="problem-modal">
        <div className="modal-head">
          <div>
            <p className="modal-eyebrow">Problem Statement Details</p>
            <h3 id="problem-modal-title">PS{problemId} - {problem.title || problem.problemTitle}</h3>
          </div>
          <button type="button" className="icon-close-btn" onClick={onClose} aria-label="Close problem details">
            ×
          </button>
        </div>

        <div className="modal-summary-grid">
          <div className="modal-summary-card">
            <span>Sector</span>
            <strong>{problem.category || problem.domain || problem.theme || "General"}</strong>
          </div>
          <div className="modal-summary-card">
            <span>Theme</span>
            <strong>{problem.theme || problem.difficultyLevel || "N/A"}</strong>
          </div>
          <div className="modal-summary-card">
            <span>Submissions</span>
            <strong>{applications.length}</strong>
          </div>
          <div className="modal-summary-card">
            <span>Deadline</span>
            <strong>{problem.deadline || problem.submissionDeadline || "Open"}</strong>
          </div>
        </div>

        <div className="modal-section">
          <h4>Problem Statement</h4>
          <p>{problem.details || problem.description || problem.problemStatement || "No problem statement description available."}</p>
        </div>

        <div className="modal-section">
          <h4>Submitted Teams</h4>
          {applications.length === 0 ? (
            <p className="workspace-empty-state">No teams have submitted against this problem yet.</p>
          ) : (
            <div className="submission-list">
              {applications.map((application) => (
                <article key={application.applicationId || application.id} className="submission-mini-card">
                  <div className="submission-mini-head">
                    <strong>{application.team?.teamName || application.teamName || "Team"}</strong>
                    <span className="submission-mini-id">Team ID: {application.team?.teamId || application.teamId || "N/A"}</span>
                  </div>
                  <p>Leader: {application.team?.leader?.fullName || application.leaderName || application.leader || "N/A"}</p>
                  <p>Submission Status: {application.submissionStatus || application.evaluationStatus || "SUBMITTED"}</p>
                  <p>AI Score: {application.aiScore ?? "-"} | Manual Score: {application.manualScore ?? "-"} | Judge Score: {application.judgeScore ?? "-"}</p>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="secondary-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default ProblemDetailsModal;