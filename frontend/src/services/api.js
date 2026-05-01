import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

export const unwrapApiData = (response) => response?.data?.data ?? response?.data ?? null;

export const login = (data) => api.post("/auth/login", data);
export const registerTeamLeader = (data) => api.post("/auth/register/team-lead", data);
export const forgotPassword = (data) => api.post("/auth/forgot-password", data);

export const getApplications = () => api.get("/applications");
export const getApplicationById = (id) => api.get(`/applications/${id}`);
export const submitJudging = (id, data) => api.put(`/applications/${id}/judging`, data);
export const submitEvaluation = (id, data) => api.put(`/applications/${id}/evaluation`, data);
export const getSubmissionViewUrl = (id) => `${API_BASE_URL}/applications/${id}/submission-file`;
export const createApplication = (formData) =>
	axios.post(`${API_BASE_URL}/applications`, formData);

export const getTeams = () => api.get("/teams");
export const createTeam = (data) => api.post("/teams", data);
export const getTeamById = (id) => api.get(`/teams/${id}`);
export const getTeamByLeaderId = (leaderId) => api.get(`/teams/leader/${leaderId}`);
export const getMyTeam = (leaderId) => api.get(`/teams/me`, { params: { leaderId } });

export const getProblems = () => api.get("/problems");
export const getProblemById = (id) => api.get(`/problems/${id}`);
export const createProblem = (data) => api.post("/problems", data);

export const getEvaluationCriteria = () => api.get("/evaluations/criteria");
export const submitCriteriaEvaluation = (data) => api.post("/evaluations", data);
export const getEvaluationDetails = (submissionId) => api.get(`/evaluations/${submissionId}`);
export const getSubmissionDetails = (submissionId) => api.get(`/evaluations/submissions/${submissionId}/details`);
export const getAllEvaluations = () => api.get("/evaluations");
export const runAiEvaluation = (data) => api.post("/evaluations/run-ai", data);
export const submitUnifiedEvaluation = (data) => api.post("/evaluations/submit", data);
export const submitUnifiedEvaluationCompat = async (data) => {
	try {
		return await api.post("/evaluations/submit", data);
	} catch (error) {
		const status = error?.response?.status;
		if (status === 404 || status === 405) {
			return api.post("/evaluation/submit", data);
		}
		throw error;
	}
};
export const getEvaluationReportCompat = async (submissionId) => {
	try {
		return await api.get(`/evaluations/report/${submissionId}`);
	} catch (error) {
		const status = error?.response?.status;
		if (status === 404 || status === 405) {
			return api.get(`/evaluation/report/${submissionId}`);
		}
		throw error;
	}
};
export const getSubmissionDetailsCompat = async (submissionId) => {
	try {
		return await api.get(`/evaluations/submissions/${submissionId}/details`);
	} catch (error) {
		const status = error?.response?.status;
		if (status === 404 || status === 405) {
			return api.get(`/evaluation/${submissionId}`);
		}
		throw error;
	}
};
export const getProblemSubmissionCount = (problemId) => api.get(`/evaluations/problems/${problemId}/solutions/count`);
export const getProblemEvaluationSummary = (problemId) => api.get(`/evaluations/problems/${problemId}/evaluation-summary`);
export const getJudgeDashboard = () => api.get("/judge/dashboard");
export const getJudgeEvaluations = () => api.get("/judge/evaluations");
export const getPendingJudgmentCount = () => api.get("/judge/dashboard/pending-count");
export const finalizeJudgeDecision = (data) => api.post("/judge/finalize", data);
export const justifyJudgeDecision = (data) => api.post("/judge/justify", data);
export const getJudgeReports = () => api.get("/judge/reports");
export const getJudgeReportById = (id) => api.get(`/judge/report/${id}`);

export const getNotifications = (userId) => api.get(`/notifications/user/${userId}`);
export const createNotification = (data) => api.post("/notifications", data);
export const markNotificationRead = (id) => api.put(`/notifications/read/${id}`);
export const createActivityLog = (data) => api.post("/notifications/activity", data);
export const getProfile = (userId) => api.get(`/profile/${userId}`);
export const getTeamMemberTeam = (userId) => api.get(`/team-member/team/${userId}`);
export const getTeamMemberApplications = (teamId) =>
	api.get(`/team-member/applications`, { params: { teamId } });

export const loginTeamMember = (data) => api.post("/team-member/login", data);

export default api;
