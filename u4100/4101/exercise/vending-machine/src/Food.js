import React from "react";
import { NavLink } from "react-router-dom";
import "./Food.css";

function Food({ heading, image_url, alt }) {

  const machine = {
    heading: "Hi. I am a Vending Machine.",
    image_url: "https://media.gettyimages.com/photos/children-and-vending-machine-picture-id537169465?s=2048x2048",
    alt: "Children standing front of vending machines.",
  }

  return (
    <div className="Food">
      <h1>{heading}</h1>
      <div className="Food-image-frame">
        <img src={image_url} alt={alt} />
      </div>
      { heading === "Hi. I am a Vending Machine." ?
        <span></span> : 
        <div>
        <NavLink className={"Food-NavLink"} exact to="/">BACK</NavLink>
        </div>
      }
    </div>
  )
}

export default Food;