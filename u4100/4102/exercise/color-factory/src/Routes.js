import React, { useState, useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { v4 as uuid } from "uuid";
import ColorForm from "./ColorForm";
import Color from "./Color";
import Home from "./Home";

function Routes() {
  const INITIAL_COLORS = [
    {
      colorName: "red",
      colorValue: "#FF0000",
      id: "#ff0000"
    },
    {
      colorName: "green",
      colorValue: "#00FF00",
      id: "#00FF00"
    },
    {
      colorName: "blue",
      colorValue: "#0000FF",
      id: "#0000FF"
    },
  ];
  const INITIAL_STATE = JSON.parse(localStorage.getItem("colors")) || INITIAL_COLORS;
  const [colors, setColors] = useState(INITIAL_STATE);

  const addColor = (newColor) => {
    setColors(colors => [{ ...newColor, id: uuid() }, ...colors]);
  };

  useEffect(() => {
    console.log(colors);
    localStorage.setItem("colors", JSON.stringify(colors));
    // console.log(JSON.parse(localStorage.getItem("colors")));
  }, [colors]);

  return (
    <Switch>
      <Route exact path="/colors/new"><ColorForm addColor={addColor} /></Route>
      <Route exact path="/colors/:color"><Color colors={colors}/></Route>
      <Route exact path="/colors"><Home colors={colors} addColor={addColor} /></Route>
      <Redirect to="/colors" />
    </Switch>
  );
}

export default Routes;