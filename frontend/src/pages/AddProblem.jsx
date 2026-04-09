import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./addproblem.css";

function AddProblem(){

const navigate = useNavigate();

const [id,setId] = useState("");
const [title,setTitle] = useState("");
const [category,setCategory] = useState("");
const [theme,setTheme] = useState("");
const [deadline,setDeadline] = useState("");
const [description,setDescription] = useState("");

const handleSubmit = (e) => {

e.preventDefault();

if(id==="" || title==="" || category==="" || theme==="" || deadline===""){
alert("Please fill all fields");
return;
}

/* Get existing problems */

const existing =
JSON.parse(localStorage.getItem("addedProblems")) || [];

/* Create new problem */

const newProblem = {
id:Number(id),
title:title,
category:category,
theme:theme,
deadline:deadline,
description:description,
submissions:0
};

/* Save */

existing.push(newProblem);

localStorage.setItem("addedProblems",JSON.stringify(existing));

alert("Problem Statement Added Successfully");

/* Redirect back */

navigate("/problems");

};

return(

<div className="add-problem-container">

<h2>Add New Problem Statement</h2>

<form onSubmit={handleSubmit} className="problem-form">

<div className="form-row">
<label>Problem ID</label>
<input
type="number"
value={id}
onChange={(e)=>setId(e.target.value)}
/>
</div>

<div className="form-row">
<label>Problem Title</label>
<input
type="text"
value={title}
onChange={(e)=>setTitle(e.target.value)}
/>
</div>

<div className="form-row">
<label>Category</label>

<select
value={category}
onChange={(e)=>setCategory(e.target.value)}
>
<option value="">Select</option>
<option>Software</option>
<option>Hardware</option>
<option>Miscellaneous</option>
</select>

</div>

<div className="form-row">

<label>Theme</label>

<select
value={theme}
onChange={(e)=>setTheme(e.target.value)}
>

<option value="">Select</option>
<option>Artificial Intelligence</option>
<option>Agriculture</option>
<option>Cyber Security</option>
<option>Health Tech</option>
<option>Smart Education</option>

</select>

</div>

<div className="form-row">

<label>Deadline</label>

<input
type="date"
value={deadline}
onChange={(e)=>setDeadline(e.target.value)}
/>

</div>

<div className="form-row">

<label>Description</label>

<textarea
rows="5"
value={description}
onChange={(e)=>setDescription(e.target.value)}
/>

</div>

<button className="submit-problem-btn">
Add Problem
</button>

</form>

</div>

);

}

export default AddProblem;