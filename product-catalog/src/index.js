import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Import your main App component
import 'bootstrap/dist/css/bootstrap.min.css'; // Optional: Import Bootstrap CSS
import './index.css'; // Optional: Import your custom CSS (if you have any)

const rootElement = document.getElementById('root'); // Target the div with id 'root'

ReactDOM.render(
  <React.StrictMode>
    <App /> 
  </React.StrictMode>,
  rootElement
);
