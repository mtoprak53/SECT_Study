import React from "react";
import "./JobCard.css";

import {
  Card, 
  CardBody, 
  CardTitle, 
  CardSubtitle, 
  CardText, 
  Button
} from 'reactstrap';

const JobCard = ({ job, inCompany=false }) => {
  const hideToggle = inCompany ? "hidden" : "";

  return (
    <div className="JobCard">
      <Card className="JobCard-Card">
        <CardBody>
          <CardTitle className="JobCard-CardTitle" tag="h5">
            {job.title}
          </CardTitle>
          <CardSubtitle
            className={`JobCard-CardSubtitle mb-2 text-muted ` + hideToggle}
            tag="h6"
          >
            {job.companyName}
          </CardSubtitle>
          <CardText className="JobCard-CardText">
            <small>
              Salary: {job.salary}
            <br />
              Equity: {+job.equity}
            </small>
          </CardText>
          <div className="button">
            <Button className="JobCard-Button" color="danger">
              APPLY
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  )

}

export default JobCard;