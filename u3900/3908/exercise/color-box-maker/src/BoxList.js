import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Box from "./Box";
import NewBoxForm from "./NewBoxForm";
import "./BoxList.css"

const BoxList = () => {
  const INITIAL_STATE = [];
  const [boxes, setBoxes] = useState(INITIAL_STATE);
  const addBox = (newBox) => {
    setBoxes(boxes => [...boxes, { ...newBox, id: uuidv4() }]);
  }

  const deleteBox = id => {
    setBoxes(boxes => boxes.filter(box => box.id !== id));
  }

  return (
    <div className="BoxList">
      <h3>New Box Form</h3>
      <NewBoxForm addBox={addBox} />
      
      <h3>Box List</h3>
      <div className="BoxList-container">
        {boxes.map(({ id, backgroundColor, width, height }) => 
          <Box 
            id={id}
            backgroundColor={backgroundColor} 
            width={width} 
            height={height} 
            deleteBox={() => deleteBox(id)}
            key={id}
          />)}
      </div>
    </div>
  )
}

export default BoxList;