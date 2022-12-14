import React from 'react';
// import logo from './logo512.png';
import './App.css';
import { ducks } from './demo';
import DuckItem from './DuckItem';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src='/public/logo512.png' className="App-logo" alt="logo" />
        {ducks.map(duck => (
          <DuckItem duck={duck} key={duck.name} />
        ))}
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
