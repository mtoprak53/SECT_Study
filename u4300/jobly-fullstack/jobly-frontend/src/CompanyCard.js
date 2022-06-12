import React from "react";
import "./CompanyCard.css";
import logo1 from "./logos/logo1.png";
import logo2 from "./logos/logo2.png";
import logo3 from "./logos/logo3.png";
import logo4 from "./logos/logo4.png";

import {
  Card, 
  CardBody, 
  CardTitle, 
  CardText
} from 'reactstrap';

const CompanyCard = ({ company }) => {

  const logoObj = {
    "/logos/logo1.png": logo1,
    "/logos/logo2.png": logo2,
    "/logos/logo3.png": logo3,
    "/logos/logo4.png": logo4,
  };

  return (
    <div className="CompanyCard">
      <Card className="CompanyCard-Card">
        <CardBody>
          <div className="CompanyCard-div">
            <CardTitle className="CompanyCard-CardTitle" tag="h5">
              {company.name}              
            </CardTitle>
            <img 
              src={logoObj[company.logoUrl]}
            />
          </div>
          <CardText className="CompanyCard-CardText">{company.description}</CardText>
        </CardBody>
      </Card>
    </div>
  )

}

export default CompanyCard;