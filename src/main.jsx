// Main entry point for the React application.
// This file renders the root component into the HTML page.
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Create a React root and mount the App component inside the element with id 'root'.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
