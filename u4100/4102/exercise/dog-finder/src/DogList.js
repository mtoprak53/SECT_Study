import React from "react";
import { Link } from "react-router-dom";
import { v4 as uuid } from "uuid";
import "./DogList.css";

function DogList({ dogs }) {
  return (
    <div className="DogList">

      {dogs.map(dog => (
        <Link 
          className="DogList-link" 
          to={`/dogs/${dog.name}`} 
          key={uuid()}
        >
          <img src={dog.src} alt={dog.name} />
          <p>{dog.name}</p>
        </Link>
      ))}
    </div>
  );
}

export default DogList;