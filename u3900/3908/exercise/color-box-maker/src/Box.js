import React from "react";
import "./Box.css";

const Box = ({ id, backgroundColor, width, height, deleteBox }) => {
  return (
    <div className="Box">
      <div style={{ backgroundColor, width, height }}></div>
      <button className="Box-btn" onClick={deleteBox}>X</button>
    </div>
  )
}

export default Box;