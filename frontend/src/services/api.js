import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

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

export const getNotifications = (userId) => api.get(`/notifications/${userId}`);
export const createActivityLog = (data) => api.post("/notifications/activity", data);
export const getProfile = (userId) => api.get(`/profile/${userId}`);
export const getTeamMemberTeam = (userId) => api.get(`/team-member/team/${userId}`);
export const getTeamMemberApplications = (teamId) =>
	api.get(`/team-member/applications`, { params: { teamId } });

export const loginTeamMember = (data) => api.post("/team-member/login", data);

export default api;
