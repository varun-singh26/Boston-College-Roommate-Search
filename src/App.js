import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import PostingsProvider from "./context/PostingsContext.jsx";
import SearchProvider from "./context/searchContext.jsx";
import FilteredPostingsProvider from "./context/FilteredPostingsContext.jsx";
import IsEditingPostingsProvider from "./components/Post/contexts/IsEditingPostContext.jsx";
import Navbar from './components/Navbar.jsx';
import LandingSplash from "./components/Homepage/LandingSplash.jsx";
import Posts from "./components/Posts/Posts.jsx"
import WelcomeToPostingsPage from "./components/Posts/WelcomeToPostingsPage/WelcomeToPostingsPage.jsx";
import PostDetailView from "./components/Post/PostDetailView.jsx";
import SignIn from "./components/SignInSignUp/SignIn.jsx";
import SignUp from "./components/SignInSignUp/SignUp.jsx";
import MyProfile from "./components/myProfile.jsx";
import ForgotPassword from "./components/SignInSignUp/ForgotPassword.jsx";
import Creation from "./components/CreatePosting/createPostingLandingSplash.jsx";
import Purpose from "./components/Purpose/purposeLandingSplash.jsx";
import Contact from "./components/Contact/contactLandingSplash.jsx";
import Footer from "./components/Footer.jsx";
import css from './App.css';

//Web App LAYOUT so far:

//Path "/" (root):
//Right now the LandingSplash component only contains the image of Gasson Hall, the On-Campus and Off-Campus button, and the search for a posting form (broken up into two forms).

//Path "/detailView":
//When rendering the detailView for a specific posting, we can add query parameters (of the posting that was clicked, such as ID) to the url.
//Then in detailView.jsx, the query parameters can be parsed and used to render the appropriate posting in the database



function RoutesWrapper() {
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
              <SignIn />
            </>
          }
        />
        <Route
          path ="/signUp"
          element = {
            <>
              <SignUp />
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
        <Route
          path ="/myProfile"
          element = {
            <>
              <MyProfile />
            </>
          }
        />

        <Route 
          path="/forgot-password"
          element = {
            <>
              <ForgotPassword />
            </>
          }
        />

        <Route
          path ="/create-posting"
          element = {
            <>
            <Creation />
            </>
          }
        />

        <Route
          path ="/our-purpose"
          element = {
            <>
              <Purpose />
            </>
          }
        />

        <Route
        path ="/contact-us"
        element = {
          <>
            <Contact />
          </>
        }
        />
        
      </Routes>
  );
}

function App() {
  return (
    <IsEditingPostingsProvider> {/* Postings Provider has to be inside this. TODO: incorporate this into auth context)*/}
      <PostingsProvider > {/* 🏠 Manage postings at a high level. PostingsProvider needs to be within a <Router> component due to its use of the useLocation() hook */}
        <SearchProvider>
          <FilteredPostingsProvider>
            <Navbar />
            <RoutesWrapper/>
            <Footer />
          </FilteredPostingsProvider>
        </SearchProvider>
      </PostingsProvider >
    </IsEditingPostingsProvider>
  );
}


export default App;
