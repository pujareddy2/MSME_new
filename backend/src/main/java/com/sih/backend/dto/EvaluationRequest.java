package com.sih.backend.dto;

public class EvaluationRequest {
	private Integer aiScore;
	private String aiRemarks;
	private Integer manualScore;
	private String manualRemarks;

	public Integer getAiScore() {
		return aiScore;
	}

	public void setAiScore(Integer aiScore) {
		this.aiScore = aiScore;
	}

	public String getAiRemarks() {
		return aiRemarks;
	}

	public void setAiRemarks(String aiRemarks) {
		this.aiRemarks = aiRemarks;
	}

	public Integer getManualScore() {
		return manualScore;
	}

	public void setManualScore(Integer manualScore) {
		this.manualScore = manualScore;
	}

	public String getManualRemarks() {
		return manualRemarks;
	}

	public void setManualRemarks(String manualRemarks) {
		this.manualRemarks = manualRemarks;
	}
}
