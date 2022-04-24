import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {

  return (
    <nav className="Navbar">
      <NavLink exact to="/">Machine</NavLink>
      <NavLink exact to="/seltzer">Seltzer</NavLink>
      <NavLink exact to="/tuna-sandwich">Tuna Sandwich</NavLink>
      <NavLink exact to="/granola-bar">Granola Bar</NavLink>
    </nav>
  );
}

export default Navbar;