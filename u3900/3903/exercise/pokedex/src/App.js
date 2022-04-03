// import logo from './logo.svg';
// import './App.css';
import pokemons from './pokemons';
import Pokedex from './Pokedex';

function App() {
  return (
    <div className="App">
      <Pokedex pokemons={ pokemons }/>
    </div>
  );
}

export default App;
