import React from "react";
import { Link } from "react-router-dom";
import SearchForm from "./SearchForm";
import CompanyCard from "./CompanyCard";
import "./Companies.css";

const Companies = ({ companies, searchCompanies }) => {

  return (
    <div className="Companies">
      <h1>{companies.length} {companies.length === 1 ? "item" : "items"}</h1>
      <SearchForm searchItems={searchCompanies} />
      {companies.map(co => 
        <Link to={`/companies/${co.handle}`} className="Companies-Link">
          <CompanyCard company={co} />
        </Link>
      )}
    </div>
  )
}

export default Companies;