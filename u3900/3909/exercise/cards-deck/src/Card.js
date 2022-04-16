import React from "react";
import "./Card.css"

const Card = ({ image, tilt }) => {
  return (
    <div className="Card" style={{ transform: `rotate(${tilt}deg)` }}>
      <img src={image} alt="card-image" />
    </div>    
  )
}

export default Card;