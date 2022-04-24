import React, { useState } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import "./App.css";

import Navbar from "./Navbar";
import Food from "./Food";

function App() {
  const items = {
    machine: {
      heading: "Hi. I am a Vending Machine.",
      image_url: "https://media.gettyimages.com/photos/children-and-vending-machine-picture-id537169465?s=2048x2048",
      alt: "Children standing front of vending machines.",
    },
    seltzer: {
      heading: "Bubbles bubbles",
      image_url: "https://media.gettyimages.com/photos/pouring-sparkling-water-into-glass-picture-id452414593?s=2048x2048",
      alt: "Seltzer pours from bottle into the glass",
    },
    tunaSandwich: {
      heading: "Got Omega-3?",
      image_url: "https://media.gettyimages.com/photos/food-picture-id463211633?s=2048x2048",
      alt: "Tuna sandwich",
    },
    granolaBar: {
      heading: "My bar is healthy!",
      image_url: "https://media.gettyimages.com/photos/granola-bars-picture-id157741824?s=2048x2048",
      alt: "Extremely nutty granola bars",
    },
  }
  return (
    <main className="App">
      <BrowserRouter>
        <Navbar />
        <Route exact path="/">
          <Food 
            heading={items.machine.heading} 
            image_url={items.machine.image_url} 
            alt={items.machine.alt}
          />
        </Route>
        <Route exact path="/seltzer">
          <Food 
            heading={items.seltzer.heading} 
            image_url={items.seltzer.image_url} 
            alt={items.seltzer.alt} 
          />
        </Route>
        <Route exact path="/tuna-sandwich">
          <Food 
            heading={items.tunaSandwich.heading} 
            image_url={items.tunaSandwich.image_url} 
            alt={items.tunaSandwich.alt} 
          />
        </Route>
        <Route exact path="/granola-bar">
          <Food 
            heading={items.granolaBar.heading} 
            image_url={items.granolaBar.image_url} 
            alt={items.granolaBar.alt} 
          />
        </Route>
      </BrowserRouter>
    </main>
  );
}

export default App;
