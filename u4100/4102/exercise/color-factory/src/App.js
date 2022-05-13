import React from 'react';
import Routes from "./Routes";
import { BrowserRouter } from 'react-router-dom';
import './App.css';

function App() {
  
  return (
    <div className="App">
      {/* <ColorList /> */}
      <BrowserRouter>
        <Routes className="App-Routes" />
      </BrowserRouter>

    </div>
  );
}

export default App;
