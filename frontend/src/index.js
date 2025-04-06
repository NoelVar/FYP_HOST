// NOTE: IMPORTS ----------------------------------------------------------------------------------
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext';
import { RecipeContextProvider } from './context/RecipeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* WRAPPING APP IN 'AuthContextProvider' */}
    <AuthContextProvider>
      <RecipeContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </RecipeContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);

// END OF DOCUMENT --------------------------------------------------------------------------------