import React from "react";
import "./Todo.css";

const Todo = ({ id, text, deleteTodo }) => {
  return (
    <div className="Todo">
      <button className="Todo-btn" onClick={deleteTodo}>X</button>
      {/* <p>{text}</p> */}
      {text}
    </div>
  )

}

export default Todo;