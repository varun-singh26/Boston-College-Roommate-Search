import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import logo from './logo.svg';
import Navbar from './components/Navbar.jsx';
import LandingSplash from "./components/Homepage/LandingSplash.jsx";
import css from './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="App">
        <header className="App-header"> 
          <img src={logo} className="App-logo" alt="logo" />
          <h1>Hello World!</h1>
          <p>
            Edit <code>src/App.js</code> and save to reload.
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
      <Routes>
        <Route 
          path ="/" 
          element={
            <>
              <Navbar />
              <LandingSplash />

            </>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
