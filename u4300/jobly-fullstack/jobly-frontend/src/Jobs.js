import React from "react";
import SearchForm from "./SearchForm";
import JobCard from "./JobCard";
import "./Jobs.css";

const Jobs = ({ jobs, searchJobs }) => {

  return (
    <div className="Jobs">      
      <h1>{jobs.length} {jobs.length === 1 ? "item" : "items"}</h1>
      <SearchForm searchItems={searchJobs} />
      {jobs.map(job => 
        <JobCard job={job} />
      )}
    </div>
  )
}

export default Jobs;