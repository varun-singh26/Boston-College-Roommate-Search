import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import Navbar from './components/Navbar.jsx';
import LandingSplash from "./components/Homepage/LandingSplash.jsx";
import Posts from "./components/Posts/Posts.jsx"
import WelcomeToPostingsPage from "./components/Posts/WelcomeToPostingsPage/WelcomeToPostingsPage.jsx";
import PostDetailView from "./components/Post/PostDetailView.jsx";
import Footer from "./components/Footer.jsx";
import css from './App.css';


//Web App LAYOUT so far:

//Path "/" (root):
//Right now the LandingSplash component only contains the image of Gasson Hall, the On-Campus and Off-Campus button, and the search for a posting form (broken up into two forms).

//Path "/postings":
//Right now the two ways of getting to "/postings" are by submitting the search form from the root path,
//(doing so updates listingLocation and formData in the SearchContext), or by clicking the "Postings" link in the Navbar. 
//However if you submit the search form but navigate back to the root page, the SearchContext becomes reinitalized again (to 0/empty).

//Path "/detailView":
//When rendering the detailView for a specific posting, we can add query parameters (of the posting that was clicked, such as ID) to the url.
//Then in detailView.jsx, the query parameters can be parsed and used to render the appropriate posting in the database



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
        <Route
          path ="/welcomeToPostings"
          element = {
            <>
              <WelcomeToPostingsPage />
            </>
          }
        />
        <Route
          path ="/detailView"
          element = {
            <>
              <PostDetailView />
            </>
          }
        />
        <Route
          path ="/signIn"
          element = {
            <>
            </>
          }
        />
        <Route
          path ="/signUp"
          element = {
            <>
            </>
          }
        />
        <Route
          path ="/about"
          element = {
            <>
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
