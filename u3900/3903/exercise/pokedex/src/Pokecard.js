import React from "react";
import "./Pokecard.css"


const Pokecard = ({ id, name, type, base_experience }) => (
  <div className="Pokecard">
    <h3 className="Pokecard-title">{ name }</h3>
    <img src={ `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png` } alt="" />
    <p>Type: { type }</p>
    <p>EXP: { base_experience }</p>
  </div>
)

export default Pokecard;