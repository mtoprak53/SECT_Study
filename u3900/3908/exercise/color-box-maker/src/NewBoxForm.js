import React, { useState } from "react";

const NewBoxForm = ({ addBox }) => {
  const INITIAL_STATE = {
    backgroundColor: "blue",
    width: '100',
    height: '100',
  }

  const [formData, setFormData] = useState(INITIAL_STATE);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(formData => ({ ...formData, [name]: value }));
  }

  const handleSubmit = e => {
    e.preventDefault();
    formData.width = `${formData.width}px`;
    formData.height = `${formData.height}px`;
    addBox({ ...formData });
    setFormData(INITIAL_STATE);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
      <label htmlFor="backgroundColor">Background Color: </label>
      <input 
        id="backgroundColor"
        type="color"
        name="backgroundColor"
        placeholder="backgroundColor"
        value={formData.backgroundColor}
        onChange={handleChange}
      />
      </div>

      <div>
      <label htmlFor="width">Width: {formData.width}</label>
      <input 
        id="width"
        type="range" min="1" max="200"
        name="width"
        value={formData.width}
        onChange={handleChange}
      />
      </div>

      <div>
      <label htmlFor="height">Height : {formData.height}</label>
      <input 
        id="height"
        type="range" min="1" max="200"
        name="height"
        value={formData.height}
        onChange={handleChange}        
      />
      </div>

      <button>Add Box!</button>
    </form>
  )
}

export default NewBoxForm;