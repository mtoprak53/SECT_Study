import React from 'react';
import Nav from "./Nav";
import Routes from "./Routes";
import { BrowserRouter } from 'react-router-dom';
import defaultProps from './defaultProps';
import './App.css';

function App() {
  const { dogs } = defaultProps;

  return (    
    <div className="App">
      <BrowserRouter>
        <Nav dogs={dogs} className="App-Nav" />
        <Routes dogs={dogs} className="App-Routes" />
      </BrowserRouter>
    </div>
  );
}

export default App;
