import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import problemData from "../data/problemData";
import { getApplications, getProblems } from "../services/api";
import "./problemstatements.css";

function ProblemStatements() {

const navigate = useNavigate();

const [categoryFilter,setCategoryFilter] = useState("");
const [themeFilter,setThemeFilter] = useState("");
const [entries,setEntries] = useState(10);
const [search,setSearch] = useState("");
const [applicationCounts, setApplicationCounts] = useState({});
const [problems, setProblems] = useState(problemData);

useEffect(() => {
getProblems()
.then((response) => {
setProblems(response.data);
})
.catch(() => {
try {
const storedProblems = JSON.parse(localStorage.getItem("addedProblems")) || [];
setProblems([...problemData, ...storedProblems]);
} catch (error) {
setProblems(problemData);
}
});

getApplications()
.then((response) => {
const counts = {};

response.data.forEach((application) => {
const problemId = application.problem?.problemId || application.problem?.id || application.problemId;
if (!problemId) {
return;
}
counts[problemId] = (counts[problemId] || 0) + 1;
});

setApplicationCounts(counts);
})
.catch(() => {
setApplicationCounts({});
});
}, []);

const allProblems = problems;

/* Filtering Logic */

const filteredProblems = allProblems.filter((problem)=>{

const matchesFilters =
(categoryFilter === "" || problem.category === categoryFilter || problem.domain === categoryFilter) &&
(themeFilter === "" || problem.theme === themeFilter || problem.difficultyLevel === themeFilter);

const searchTerm = search.toLowerCase();
const matchesSearch =
(problem.title || problem.problemTitle || "").toLowerCase().includes(searchTerm) ||
(problem.category || problem.domain || "").toLowerCase().includes(searchTerm) ||
(problem.theme || problem.difficultyLevel || "").toLowerCase().includes(searchTerm) ||
(problem.description || problem.problemDescription || "").toLowerCase().includes(searchTerm);

return matchesFilters && matchesSearch;

});

const visibleProblems = filteredProblems.slice(0, entries);

return(

<div className="ps-page">

<h1 className="ps-title">
TS-MSME Problem Statements
</h1>

{/* Top Buttons */}

<div className="top-actions">

<a
href="/MSME_Template.pptx"
download
className="template-btn"
>
Download PPT Template
</a>

<button
className="add-problem-btn"
onClick={()=>navigate("/login?source=addproblem")}
>
Add Problem Statement
</button>

</div>

{/* Filters */}

<div className="filters">

<div className="filter-box">

<label>Category</label>

<select
value={categoryFilter}
onChange={(e)=>setCategoryFilter(e.target.value)}
>

<option value="">All</option>
<option value="Software">Software</option>
<option value="Hardware">Hardware</option>
<option value="Miscellaneous">Miscellaneous</option>

</select>

</div>

<div className="filter-box">

<label>Theme</label>

<select
value={themeFilter}
onChange={(e)=>setThemeFilter(e.target.value)}
>

<option value="">All</option>
<option value="Artificial Intelligence">Artificial Intelligence</option>
<option value="Smart Education">Smart Education</option>
<option value="Health Tech">Health Tech</option>
<option value="Agriculture">Agriculture</option>
<option value="Sustainable Development">Sustainable Development</option>

</select>

</div>

</div>

{/* Entries + Search Row */}

<div className="table-controls">

<div className="entries-box">
Show
<select
value={entries}
onChange={(e)=>setEntries(Number(e.target.value))}
>
<option value={10}>10</option>
<option value={25}>25</option>
<option value={50}>50</option>
<option value={100}>100</option>
</select>
entries
</div>

<div className="search-box">
Search:
<input
type="text"
value={search}
onChange={(e)=>setSearch(e.target.value)}
placeholder="Search problems"
/>
</div>

</div>

{/* Table */}

<div className="table-container">

<table className="ps-table">

<thead>

<tr>
<th>ID</th>
<th>Problem Statement</th>
<th>Category</th>
<th>Theme</th>
<th>Deadline</th>
<th>Submissions</th>
</tr>

</thead>

<tbody>

{visibleProblems.map((problem)=>(

<tr key={problem.id || problem.problemId}>

<td>{problem.id || problem.problemId}</td>

<td
className="problem-link"
onClick={()=>navigate(`/problems/${problem.id || problem.problemId}`)}
>
{problem.title || problem.problemTitle}
</td>

<td>{problem.category || problem.domain}</td>
<td>{problem.theme || problem.difficultyLevel}</td>
<td>{problem.deadline || problem.submissionDeadline}</td>
<td>
	{(applicationCounts[problem.id || problem.problemId] || problem.submissions || 0)} / {(problem.max || 100)}
</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

);

}

export default ProblemStatements;