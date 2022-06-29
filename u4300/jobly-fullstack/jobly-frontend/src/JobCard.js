import React, { useState } from "react";
import JoblyApi from "./api";
import "./JobCard.css";

import {
  Card, 
  CardBody, 
  CardTitle, 
  CardSubtitle, 
  CardText, 
  Button
} from 'reactstrap';

// const JobCard = ({ job, applications, applyJob, isApplied=false, inCompany=false }) => {
const JobCard = ({ job, applyJob, isApplied=false, inCompany=false }) => {
  // const [isApplied, setIsApplied] = useState(null);

  const hideToggle = inCompany ? "hidden" : "";
  // console.log(user);
  // console.log(applications);

  // const applyJob = async (username, jobId) => {
  //   await JoblyApi.applyToTheJob(username, jobId);
  // };

  // TODO: A FUNCTION TO CHECK IF IT IS APPLIED EARLIER
  if (job.id)

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
            {
              isApplied 
                ?
              <Button 
                className="JobCard-Button" 
                color="danger" 
                disabled
              >
                APPLIED
              </Button>
                :              
              <Button 
                className="JobCard-Button" 
                color="danger" 
                onClick={(async () => {
                  await applyJob(job.id);
                  // setIsApplied(true);
                })}
              >
                APPLY
              </Button>
            }
          </div>
        </CardBody>
      </Card>
    </div>
  )

}

export default JobCard;