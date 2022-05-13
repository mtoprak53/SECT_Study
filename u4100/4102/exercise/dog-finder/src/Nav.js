import React from "react";
import { Link, NavLink } from "react-router-dom";
import "./Nav.css";

function Nav({ dogs }) {
  
  return (
    <ul className="Nav">
      <li>
        <NavLink to="/dogs" className="Nav-link">
          <h3>HOME</h3>
        </NavLink>
      </li>
      {dogs.map(dog => (
        <li key={dog.name}>
          {/* <Link to={`/dogs/${dog.name}`} className="Nav-link">
            <h3>{dog.name}</h3>
          </Link> */}
          <NavLink to={`/dogs/${dog.name}`} className="Nav-link">
            <h3>{dog.name}</h3>
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

export default Nav;