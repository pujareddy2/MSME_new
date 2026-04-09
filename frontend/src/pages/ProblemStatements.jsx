import { useState } from "react";
import { useNavigate } from "react-router-dom";
import problemData from "../data/problemData";
import "./problemstatements.css";

function ProblemStatements() {

const navigate = useNavigate();

const [categoryFilter,setCategoryFilter] = useState("");
const [themeFilter,setThemeFilter] = useState("");
const [entries,setEntries] = useState(10);
const [search,setSearch] = useState("");

const storedProblems =
JSON.parse(localStorage.getItem("addedProblems")) || [];

const allProblems = [...problemData, ...storedProblems];

/* Filtering Logic */

const filteredProblems = allProblems.filter((problem)=>{

const matchesFilters =
(categoryFilter === "" || problem.category === categoryFilter) &&
(themeFilter === "" || problem.theme === themeFilter);

const matchesSearch =
problem.category.toLowerCase().includes(search.toLowerCase()) ||
problem.theme.toLowerCase().includes(search.toLowerCase());

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

<tr key={problem.id}>

<td>{problem.id}</td>

<td
className="problem-link"
onClick={()=>navigate(`/problems/${problem.id}`)}
>
{problem.title}
</td>

<td>{problem.category}</td>
<td>{problem.theme}</td>
<td>{problem.deadline}</td>
<td>{problem.submissions}</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

);

}

export default ProblemStatements;