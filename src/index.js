import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import ReactDOM from 'react-dom/client';
import './index.css';
import AuthProvider from './context/authContext/index.jsx';
import NavigationProvider from './context/Navigation/NavigationContext.jsx';
import ResetTriggerProvider, { ResetTriggerContext } from './context/resetTriggerContext.jsx';
import App from './App';
import reportWebVitals from './reportWebVitals';

/*Want there to be a single context for listingLocation and formData throughout the app session. That's why we wrap our App with Search Provider.
 Refer to src/context/searchContext.jsx*/
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router> 
      <AuthProvider> {/* 🔐 Wraps everything that needs authentication  */}
        <NavigationProvider> {/* 🌍 Tracks page transitions */}
          <ResetTriggerProvider>
            <App />
          </ResetTriggerProvider>
        </NavigationProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
