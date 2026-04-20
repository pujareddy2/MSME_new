import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import problemData from "../data/problemData";
import { createActivityLog, getApplications, getProblems } from "../services/api";
import { getStoredTeam, getStoredUser } from "../utils/session";
import "./problemstatements.css";

function ProblemStatements() {
	const navigate = useNavigate();
	const currentUser = getStoredUser();
	const currentTeam = getStoredTeam();

	const [categoryFilter, setCategoryFilter] = useState("");
	const [themeFilter, setThemeFilter] = useState("");
	const [entries, setEntries] = useState(10);
	const [search, setSearch] = useState("");
	const [applicationCounts, setApplicationCounts] = useState({});
	const [problems, setProblems] = useState(problemData);

	useEffect(() => {
		getProblems()
			.then((response) => setProblems(response.data || []))
			.catch(() => {
				try {
					const storedProblems = JSON.parse(localStorage.getItem("addedProblems")) || [];
					setProblems([...problemData, ...storedProblems]);
				} catch {
					setProblems(problemData);
				}
			});

		getApplications()
			.then((response) => {
				const counts = {};
				(response.data || []).forEach((application) => {
					const problemId = application.problem?.problemId || application.problem?.id || application.problemId;
					if (problemId) {
						counts[problemId] = (counts[problemId] || 0) + 1;
					}
				});
				setApplicationCounts(counts);
			})
			.catch(() => setApplicationCounts({}));
	}, []);

	const filteredProblems = useMemo(() => {
		return problems.filter((problem) => {
			const categoryValue = problem.category || problem.domain || "";
			const themeValue = problem.theme || problem.difficultyLevel || "";
			const searchTerm = search.toLowerCase();

			const matchesFilters =
				(categoryFilter === "" || categoryValue === categoryFilter) &&
				(themeFilter === "" || themeValue === themeFilter);

			const matchesSearch =
				(problem.title || problem.problemTitle || "").toLowerCase().includes(searchTerm) ||
				categoryValue.toLowerCase().includes(searchTerm) ||
				themeValue.toLowerCase().includes(searchTerm) ||
				(problem.organizationName || problem.org || "").toLowerCase().includes(searchTerm) ||
				(`PS${problem.id || problem.problemId}`).toLowerCase().includes(searchTerm);

			return matchesFilters && matchesSearch;
		});
	}, [problems, categoryFilter, themeFilter, search]);

	const visibleProblems = filteredProblems.slice(0, entries);

	const handleApply = (problemId) => {
		const userRole = currentUser?.role || localStorage.getItem("role");

		if (!currentUser) {
			navigate("/login");
			return;
		}

		if (userRole !== "TEAM_LEAD") {
			alert("Only Team Leaders can submit applications.");
			return;
		}

		if (!currentTeam?.teamId) {
			alert("You must add team members before applying.");
			navigate("/create-team");
			return;
		}

		navigate(`/apply/${problemId}`);
	};

	const handleProblemSelection = (problem) => {
		const problemId = problem.id || problem.problemId;
		const title = problem.title || problem.problemTitle || `PS${problemId}`;

		if (currentUser?.role === "TEAM_LEAD" && currentUser?.userId) {
			createActivityLog({
				userId: currentUser.userId,
				message: `Problem selected: ${title}`,
			}).catch(() => undefined);
		}

		navigate(`/problems/${problemId}`);
	};

	return (
		<div className="ps-page">
			<h1 className="ps-title">Problem Statements</h1>

			<div className="top-actions">
				<a href="/Hackathon_Template.pptx" download className="template-btn">
					Download PPT Template
				</a>

				<button className="add-problem-btn" onClick={() => navigate("/login?source=addproblem")}>
					Add Problem Statement
				</button>
			</div>

			<div className="table-controls">
				<div className="controls-left">
					<div className="control-inline entries-box">
						<label htmlFor="entries-select">Show</label>
						<select id="entries-select" value={entries} onChange={(e) => setEntries(Number(e.target.value))}>
							<option value={10}>10</option>
							<option value={25}>25</option>
							<option value={50}>50</option>
							<option value={100}>100</option>
						</select>
						<span>entries</span>
					</div>

					<div className="control-inline filter-box">
						<label htmlFor="category-filter">Category</label>
						<select id="category-filter" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
							<option value="">All</option>
							<option value="Software">Software</option>
							<option value="Hardware">Hardware</option>
							<option value="Miscellaneous">Miscellaneous</option>
						</select>
					</div>

					<div className="control-inline filter-box">
						<label htmlFor="theme-filter">Theme</label>
						<select id="theme-filter" value={themeFilter} onChange={(e) => setThemeFilter(e.target.value)}>
							<option value="">All</option>
							<option value="Artificial Intelligence">Artificial Intelligence</option>
							<option value="Smart Education">Smart Education</option>
							<option value="Health Tech">Health Tech</option>
							<option value="Agriculture">Agriculture</option>
							<option value="Sustainable Development">Sustainable Development</option>
						</select>
					</div>
				</div>

				<div className="control-inline search-box">
					<label htmlFor="problem-search">Search</label>
					<input
						id="problem-search"
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search by title, organization, category, PS number"
					/>
				</div>
			</div>

			<div className="table-container">
				<table className="ps-table">
					<thead>
						<tr>
							<th>S.No</th>
							<th>Organization</th>
							<th>Problem Statement Title</th>
							<th>Category</th>
							<th>PS Number</th>
							<th>Submitted Ideas Count</th>
							<th>Team Capacity</th>
							<th>Submission Deadline</th>
							<th>Apply</th>
						</tr>
					</thead>

					<tbody>
						{visibleProblems.map((problem, index) => {
							const problemId = problem.id || problem.problemId;
							const maxSubmissions = problem.maxSubmissions || problem.max || 300;
							const submissionCount = applicationCounts[problemId] || problem.submissions || 0;

							return (
								<tr key={problemId}>
									<td>{index + 1}</td>
									<td>{problem.organizationName || problem.org || "Hackathon"}</td>
									<td className="problem-link" onClick={() => handleProblemSelection(problem)}>
										{problem.title || problem.problemTitle}
									</td>
									<td>{problem.category || problem.domain}</td>
									<td>{problem.psNumber || `PS${problemId}`}</td>
									<td>{submissionCount} / {maxSubmissions}</td>
									<td>Team Size: 6</td>
									<td>{problem.deadline || problem.submissionDeadline}</td>
									<td>
										{submissionCount >= maxSubmissions ? (
											<button className="view-btn" disabled>Submissions Closed</button>
										) : (
											<button className="apply-btn" onClick={() => handleApply(problemId)}>Apply</button>
										)}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default ProblemStatements;