import React, { useState } from "react";
import "./EightBall.css";
import answers from "./answers";

const EightBall = () => {
  const genRandom = () => Math.floor(Math.random() * 20);
  let randomNum = genRandom();
  const ballClick = () => {
    setColor(answers[randomNum].color);
    setText(answers[randomNum].msg);
    setCounter(counter + 1);
  };

  const [color, setColor] = useState("black");
  const [text, setText] = useState("Think of a Question");
  const [counter, setCounter] = useState(0);

  return (
    <div className="EightBall">
      <div className={ "EightBall-ball " + color }
            onClick={ballClick}>
        <p className="EightBall-ball-text">{ text }</p>
      </div>
      <div>
        <p>Click #: {counter}</p>        
      </div>
    </div>
  )
};

export default EightBall;