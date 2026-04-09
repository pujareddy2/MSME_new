import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

export const getApplications = () => api.get("/applications");
export const createApplication = (formData) =>
	axios.post(`${API_BASE_URL}/applications`, formData);

export const getTeams = () => api.get("/teams");
export const createTeam = (data) => api.post("/teams", data);
export const getTeamById = (id) => api.get(`/teams/${id}`);

export const getProblems = () => api.get("/problems");
export const getProblemById = (id) => api.get(`/problems/${id}`);
export const createProblem = (data) => api.post("/problems", data);

export default api;
