import React from "react";
import "./ItemCard.css";
import logo1 from "./logos/logo1.png";
import logo2 from "./logos/logo2.png";
import logo3 from "./logos/logo3.png";
import logo4 from "./logos/logo4.png";

import {
  Card, 
  CardBody, 
  CardTitle, 
  CardSubtitle, 
  CardText, 
  Button
} from 'reactstrap';

const ItemCard = ({ type, item }) => {

  const logoObj = {
    "/logos/logo1.png": logo1,
    "/logos/logo2.png": logo2,
    "/logos/logo3.png": logo3,
    "/logos/logo4.png": logo4,
  };

  if (type === company) {
    const cardTitle = type === company ? item.name : item.title;
    const cardSubtitle = type === company ? "hidden" : item.companyName;
    const cardImage = type === company ? logoObj[item.logoUrl] : "hidden";
    const cardText = type === company ? logoObj[item.logoUrl] : <small>Salary: {job.salary}<br />Equity: {+job.equity}</small>
  };
  if (type === job) {};
  if (type === companyjob) {};

  

  return (
    <div className="ItemCard">
      <Card className="ItemCard-Card">
        <CardBody>

          <div className="ItemCard-div">

            {/* <div className="ItemCard-CardTitle-div"> */}
            <div className={cardTitle}>
              <CardTitle className="ItemCard-CardTitle" tag="h5">
                {cardTitle}
              </CardTitle>
            </div>

            {/* <div className="ItemCard-CardSubtitle-div"> */}
            <div className={cardSubtitle}>
              <CardSubtitle
                className="ItemCard-CardSubtitle mb-2 text-muted"
                tag="h6"
              >
                {cardSubtitle}
              </CardSubtitle>
            </div>

            {/* <div className="ItemCard-CardImage-div"> */}
            <div className={cardImage}>
              <img 
                src={cardImage}
              />
            </div>

          </div>

          {/* <div className="ItemCard-CardText-div"> */}
          <div className={cardText}>
            <CardText className="ItemCard-CardText">
              {cardText}
            </CardText>
          </div>

          {/* <div className="ItemCard-Button-div"> */}
          <div className={button}>
            <Button className="ItemCard-Button" color="danger">
              APPLY
            </Button>
          </div>

        </CardBody>
      </Card>
    </div>
  )

}

export default ItemCard;