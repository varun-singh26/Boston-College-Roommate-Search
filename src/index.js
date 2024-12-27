import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import SearchProvider from './context/searchContext.jsx';
import App from './App';
import reportWebVitals from './reportWebVitals';

//Want there to be a single context for listingLocation and formData throughout the app session
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SearchProvider>
      <App />
    </SearchProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
