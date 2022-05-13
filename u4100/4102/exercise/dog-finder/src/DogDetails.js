import React from "react";
import { useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import "./DogDetails.css";

function DogDetails({ dogs }) {
  const { name } = useParams();

  const dog = dogs.filter(d => d.name === name)[0];

  return (
    <div className="DogDetails">
      {/* {console.log(dogs)}
      {console.log(dog)}
      {console.log(name)} */}

      <img src={dog.src} alt={dog.name} />
      <div className="DogDetails-info">
        <div className="DogDetails-name-age">
          <h3>{dog.name}</h3>
          <p><b>Age:</b> {dog.age}</p>
        </div>
        <ul>
        <b>Facts:</b>
          {dog.facts.map(fact => (
            <li key={uuid()}>{fact}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DogDetails;