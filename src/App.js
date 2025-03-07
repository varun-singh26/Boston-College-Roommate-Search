import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import PostingsProvider from "./context/PostingsContext.jsx";
import SearchProvider from "./context/searchContext.jsx";
import FilteredPostingsProvider from "./context/FilteredPostingsContext.jsx";
import IsEditingPostingsProvider from "./components/Post/contexts/IsEditingPostContext.jsx";
import Navbar from './components/NavBar/Navbar.jsx';
import MainSignInPage from "./components/mainSignIn/mainSignInPage.jsx";
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
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute.jsx";
import { AuthProvider } from "./context/authContext/index.jsx"
import Swal from 'sweetalert2';
 
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

  const isMobile = window.innerWidth < 426;

  if (isMobile) {
    Swal.fire({
      title: 'Mobile Warning',
      text: 'This website is not optimized for mobile devices. Please use a desktop or laptop for the best experience.',
      icon: 'warning',
      confirmButtonText: 'I wish to continue anyway'
    })
  }
    


  return (
      <Routes>
        {/* Public route: Sign-in page */}
        <Route
          path="/signin-wall"
          element={
            <MainSignInPage />
          }
        />

        {/* Protected route: Home page */}
          <Route 
            path ="/" 
            element={
              <ProtectedRoute>
                <LandingSplash />
              </ProtectedRoute>
            } 
          />
          <Route
            path ="/postings"
            element = {
              <ProtectedRoute>
                <Posts />
              </ProtectedRoute>
            }
          />
          <Route
            path ="/welcomeToPostings"
            element = {
              <ProtectedRoute>
                <WelcomeToPostingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path ="/detailView"
            element = {
              <ProtectedRoute>
                <PostDetailView />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path ="/signIn"
            element = {
              <>
                <SignIn />
              </>
            }
          /> */}
          {/* <Route
            path ="/signUp"
            element = {
              <>
                <SignUp />
              </>
            }
          /> */}
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
              <ProtectedRoute>
                <MyProfile />
              </ProtectedRoute>
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
            <ProtectedRoute>
              <Creation />
            </ProtectedRoute>
            }
          />

          <Route
            path ="/our-purpose"
            element = {
              <ProtectedRoute>
                <Purpose />
              </ProtectedRoute>
            }
          />

          <Route
          path ="/contact-us"
          element = {
            <ProtectedRoute>
              <Contact />
            </ProtectedRoute>
          }
          />

           {/* Default: Redirect to sign-in */}
           <Route path="*" element={<Navigate to="/signin-wall" />} />
          
      </Routes>
  );
}

function App() {

  const location = useLocation();
  const hideNavbarRoutes = ["/signin-wall"];
  const hideFooterRoutes = ["/signin-wall"];
  
  return (
  <AuthProvider> {/* Provides authentication state */}
    <IsEditingPostingsProvider> {/* Postings Provider has to be inside this. TODO: incorporate this into auth context)*/}
      <PostingsProvider > {/* 🏠 Manage postings at a high level. PostingsProvider needs to be within a <Router> component due to its use of the useLocation() hook */}
        <SearchProvider>
          <FilteredPostingsProvider>
            {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
            <RoutesWrapper/>
            {!hideFooterRoutes.includes(location.pathname) && <Footer />}          
          </FilteredPostingsProvider>
        </SearchProvider>
      </PostingsProvider >
    </IsEditingPostingsProvider>
  </AuthProvider>
  );
}


export default App;
