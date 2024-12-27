import React, {createContext, useState} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import logo from './logo.svg';
import Navbar from './components/Navbar.jsx';
import LandingSplash from "./components/Homepage/LandingSplash.jsx";
import Posts from "./components/Posts/Posts.jsx"
import Footer from "./components/Footer.jsx";
import css from './App.css';


function App({data}) {
  //TODO: Will This Layout Work?
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route 
          path ="/" 
          element={
            <>
              <LandingSplash />
            </>
          } 
        />
        <Route
          path ="/page=listings"
          element = {
            <>
              <Posts data = {data} />
            </>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
