import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import SearchProvider from './context/searchContext.jsx';
import DataProvider from './context/dataContext.jsx';
import FilteredPostingsProvider from './context/FilteredPostingsContext.jsx';
import App from './App';
import reportWebVitals from './reportWebVitals';

/*Want there to be a single context for listingLocation and formData throughout the app session. That's why we wrap our App with Search Provider.
 Refer to src/context/searchContext.jsx*/
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SearchProvider>
      <DataProvider>
        <FilteredPostingsProvider>
          <App />
        </FilteredPostingsProvider>
      </DataProvider>
    </SearchProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
