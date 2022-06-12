import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import JoblyApi from "./api";
// import SearchForm from "./SearchForm";
import JobCard from "./JobCard";
// import "./Jobs.css";

const Company = () => {
  let { handle } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [company, setCompany] = useState([]);

  useEffect(() => {
    async function getCompany() {
      let company = await JoblyApi.getCompany(handle);
      setCompany(company);
      setIsLoading(false);
    }
    getCompany();
  }, []);

  if (isLoading) {
    return <h3 className="App-loading">Loading &hellip;</h3>;
  }

  return (
    <div className="Jobs">
      <div className="Jobs-Company">
        <h3>{company.name}</h3>
        <h5>{company.description}</h5>
      </div>
      
      {company.jobs.map(job => 
        <JobCard job={job} inCompany="true" />
      )}
    </div>
  )
}

export default Company;