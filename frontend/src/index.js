import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
//import axios from 'axios';
//import AuthService from './services/authService';

// Setup axios interceptor
//AuthService.setupAxiosInterceptor(axios);

//const token = sessionStorage.getItem('token');
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// END OF DOCUMENT --------------------------------------------------------------------------------