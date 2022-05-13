import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./ColorForm.css";

function ColorForm({ addColor }) {
  const INITIAL_STATE = {
    colorName: "",
    colorValue: ""
  };
  const [colorData, setColorData] = useState(INITIAL_STATE);

  function handleChange(evt) {
    const { name, value } = evt.target;
    setColorData(cData => ({
      ...cData,
      [name]: value
    }));
    // console.log(colorData);
  };

  const history = useHistory();
  function handleSubmit(evt) {
    evt.preventDefault();
    if (colorData.colorName && colorData.colorValue) {
      addColor(colorData);
      // console.log(colorData);
      history.push("/colors");
    }
    else{
      alert("Enter both fields.");
    }
  };

  return (    
    <main>
      <form onSubmit={handleSubmit}>
        <label className="large-label">Color name: </label>
        <input type="text" name="colorName" onChange={handleChange} />
        <label className="large-label">Color value: </label>
        <input type="color" name="colorValue" onChange={handleChange} />
        <button type="submit">Add this color</button>
      </form>
    </main>
  );
}

export default ColorForm;