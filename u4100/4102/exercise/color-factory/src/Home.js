import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home({ colors }) {
  // console.log(colors);

  return (
    <div className="Home">
      <div className="Home-FormLink">
        <h3>Welcome to the color factory.</h3>
        <div className="separator"></div>
        <Link to="/colors/new" style={{color: "whitesmoke"}}><h2>Add a color</h2></Link>
      </div>

      <div className="Home-FormList">
      <p>Please select a color.</p>
        <ul>
          {colors.map(color => (
            <li key={color.id}><Link to={`/colors/${color.colorName}`}>{color.colorName}</Link></li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Home; 