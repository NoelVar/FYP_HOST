// NOTE: IMPORTS ----------------------------------------------------------------------------------
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PageNotFound from './pages/PageNotFound';
import Recipe from './pages/Recipe';
import CreateNewRecipe from './components/CreateNewRecipe';
import NavBar from './components/NavBar';
import { useState } from 'react';
import SingleRecipe from './pages/SingleRecipe';
import Discussions from './pages/Discussions';
import SuggestVariation from './pages/SuggestVariation';
import { useAuthContext } from './hooks/useAuthContext';

function App() {  

  // NOTE: ONLY SHOWING NAVBAR ON NEEDED PAGES (https://stackoverflow.com/questions/76942172/in-react-how-to-have-a-navbar-on-specific-pages-only)
  const [showNavbar, setShowNavbar] = useState(true);
  const { user } = useAuthContext();

  // NOTE: RETURNING COMPONENTS AND PAGES
  return (
    <div className="app-container">
        {showNavbar && <NavBar />}
        <Routes>
            <Route
              path='/'
              element={<Home setShowNavbar={setShowNavbar}/>}
            />
            <Route 
              path='/recipes'
              element={<Recipe setShowNavbar={setShowNavbar}/>}
            />
            {/* ADDING VALIDATION TO ROUTE AND REDIRECTING IF USER ISNT LOGGED IN */}
            <Route
              path='/newrecipe'
              element={user ? <CreateNewRecipe setShowNavbar={setShowNavbar}/> : <Navigate to={'/login'} />}
            />
            <Route
              path='recipes/:id'
              element={<SingleRecipe setShowNavbar={setShowNavbar}/>}
            />
            <Route
              path='recipes/:id/discussion'
              element={<Discussions setShowNavbar={setShowNavbar}/>}
            />
            {/* ADDING VALIDATION TO ROUTE AND REDIRECTING IF USER ISNT LOGGED IN */}
             <Route
              path='recipes/:id/suggest-variation'
              element={user ? <SuggestVariation setShowNavbar={setShowNavbar}/> : <Navigate to={'/login'} />}
            />
            <Route 
              path='/login'
              element={<Login setShowNavbar={setShowNavbar}/>}
            />
            <Route 
              path='/signup'
              element={<Register setShowNavbar={setShowNavbar}/>}
            />
            <Route 
              path='/*'
              element={<PageNotFound setShowNavbar={setShowNavbar}/>}
            />
        </Routes>
    </div>
  );
}

export default App;

// END OF DOCUMENT --------------------------------------------------------------------------------
