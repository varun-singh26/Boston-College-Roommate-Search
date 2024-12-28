import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import Navbar from './components/Navbar.jsx';
import LandingSplash from "./components/Homepage/LandingSplash.jsx";
import Posts from "./components/Posts/Posts.jsx"
import Footer from "./components/Footer.jsx";
import css from './App.css';


//TODO: Will This Layout Work?
function RoutesWrapper({ data }) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const page = queryParams.get("page");

  return (
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
          path ="/postings"
          element = {
            <>
              <Posts />
            </>
          }
        />
      </Routes>
  );
}

function App({data}) {
  return (
    <Router>
      <Navbar />
      <RoutesWrapper data={data} />
      <Footer />
    </Router>
  );
}


export default App;
