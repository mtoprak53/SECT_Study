import React from "react";
import SearchForm from "./SearchForm";
import JobCard from "./JobCard";
import "./Jobs.css";

const Jobs = ({ jobs, applications, searchJobs, applyJob }) => {
  const appSet = new Set(applications);

  return (
    <div className="Jobs">      
      <h1>{jobs.length} {jobs.length === 1 ? "item" : "items"}</h1>
      <SearchForm searchItems={searchJobs} />
      {jobs.map(job => 
        <JobCard 
          // username={username} 
          job={job} 
          // applications={applications} 
          isApplied = {appSet.has(job.id)}
          applyJob={applyJob} 
          key={job.id} 
        />
      )}
    </div>
  )
}

export default Jobs;