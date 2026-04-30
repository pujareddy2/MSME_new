function CriteriaScoreGrid({ criteria = [], scores = {}, onScoreChange, onReviewChange, disabled = false }) {
  if (!criteria.length) {
    return <p className="workspace-empty-state">No evaluation criteria available.</p>;
  }

  return (
    <div className="criteria-grid">
      {criteria.map((criterion, index) => {
        const criterionId = String(criterion.criteriaId);
        const currentValue = scores[criterionId]?.score ?? "";
        const currentReview = scores[criterionId]?.reviewText ?? "";

        return (
          <article key={criterionId} className="criteria-card">
            <div className="criteria-card-header">
              <div>
                <p className="criteria-order">Criterion {index + 1}</p>
                <h4>{criterion.criteriaName}</h4>
              </div>
              <span className="criteria-weight">{criterion.weightPercentage ?? 0}%</span>
            </div>

            <p className="criteria-description">{criterion.description || "No description provided."}</p>

            <label className="field-label" htmlFor={`score-${criterionId}`}>
              Score out of {criterion.maxScore ?? 100}
            </label>
            <input
              id={`score-${criterionId}`}
              className="score-input"
              type="number"
              min="0"
              max="100"
              value={currentValue}
              onChange={(event) => onScoreChange(criterion.criteriaId, event.target.value)}
              disabled={disabled}
              placeholder="0 - 100"
            />

            <label className="field-label" htmlFor={`review-${criterionId}`}>
              Review
            </label>
            <textarea
              id={`review-${criterionId}`}
              className="score-review"
              value={currentReview}
              onChange={(event) => onReviewChange(criterion.criteriaId, event.target.value)}
              disabled={disabled}
              placeholder="Add evaluation notes for this criterion"
            />
          </article>
        );
      })}
    </div>
  );
}

export default CriteriaScoreGrid;