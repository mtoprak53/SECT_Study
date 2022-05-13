import React from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import "./Color.css";

function Color({ colors }) {
  const history = useHistory();
  const { color } = useParams();

  // AVOID ROUTING FOR ABSENT COLORS
  const colorObj = colors.find(c => c.colorName === color);
  if (!colorObj) {
    history.push("/colors");
  }

  const { colorValue } = colorObj;
  return (    
    <div className="Color" style={{backgroundColor: colorValue, color: "whitesmoke"}}>
      <h1>THIS IS {color.toUpperCase()}</h1>
      <br /><br />
      <h1>ISN'T IT BEAUTIFUL?</h1>
      <br /><br />
      
      <Link to="/colors" 
            style={{backgroundColor: colorValue, color: "whitesmoke"}}>
        <h1>GO BACK</h1>
      </Link>
    </div>
  );
}

export default Color;