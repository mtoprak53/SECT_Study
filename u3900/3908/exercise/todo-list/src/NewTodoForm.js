import React, { useState } from "react";

const NewTodoForm = ({ addTodo }) => {
  const INITIAL_STATE = { text: "" };
  const [formData, setFormData] = useState(INITIAL_STATE);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(formData => ({ ...formData, [name]: value }));
  }

  const handleSubmit = e => {
    e.preventDefault();
    addTodo({ ...formData });
    setFormData(INITIAL_STATE);
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* <div> */}
        <label htmlFor="text">New Todo: </label>
        <input 
          id="text"
          type="text"
          name="text"
          placeholder="New Todo"
          value={formData.text}
          onChange={handleChange}
        />
      {/* </div> */}
      <button style={{
        display: "inline", 
        marginLeft: "5px", 
        width: "50px"}}>Add</button>
    </form>
  )
}

export default NewTodoForm;