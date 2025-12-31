import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import App from './App';
import './styles/globals.css';

// Create a container element if it doesn't exist
let container = document.getElementById('root');
if (!container) {
  container = document.createElement('div');
  container.id = 'root';
  document.body.appendChild(container);
}

// Create root and render the app
const root = ReactDOMClient.createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);