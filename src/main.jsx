import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';



// Import CSS từ node_modules
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap-table/dist/bootstrap-table.min.css';
import 'react-toastify/dist/ReactToastify.css';

// Import JS cho Bootstrap và Bootstrap Table
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-table/dist/bootstrap-table.min.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);