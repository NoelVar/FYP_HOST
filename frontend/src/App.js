// NOTE: IMPORTS ----------------------------------------------------------------------------------
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PageNotFound from './pages/PageNotFound';
import Recipe from './pages/Recipe';
import CreateNewRecipe from './components/CreateNewRecipe';
import NavBar from './components/NavBar';
import { useEffect, useState } from 'react';
import SingleRecipe from './pages/SingleRecipe';
import Discussions from './pages/Discussions';
import SuggestVariation from './pages/SuggestVariation';
import { useAuthContext } from './hooks/useAuthContext';
import UserProfile from './pages/UserProfile';
import AllUserProfiles from './pages/AllUserProfiles';
import ControllRecipes from './pages/ControllRecipes';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';

function App() {  

  // NOTE: ONLY SHOWING NAVBAR ON NEEDED PAGES (https://stackoverflow.com/questions/76942172/in-react-how-to-have-a-navbar-on-specific-pages-only)
  const [showNavbar, setShowNavbar] = useState(true);
  const { user } = useAuthContext();
  const [currentUser, setCurrentUser] = useState(null)
  
  useEffect(() => {
    const fetchUser = async () => {
        const email = user.email
        const response = await fetch('http://localhost:4000/user/single-user', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({email})
        })
        const json = await response.json()

        if (response.ok) {
            setCurrentUser(json)
        }
    }

    if (user) {
        fetchUser()
    }
  }, [user])

  // NOTE: RETURNING COMPONENTS AND PAGES
  return (
    <div>
    {currentUser ?
      // NOTE: ROUTE HANDLING WHEN USER IS LOGGED IN ----------------------------------------------
      <div className="app-container">
          {showNavbar && <NavBar role={currentUser.role}/>}
          <Routes>
              <Route
                path='/'
                element={<Home setShowNavbar={setShowNavbar}/>}
              />
              <Route 
                path='/recipes'
                element={<Recipe setShowNavbar={setShowNavbar} role={currentUser.role}/>}
              />
              {/* ADDING VALIDATION TO ROUTE AND REDIRECTING IF USER ISNT LOGGED IN */}
              <Route
                path='/newrecipe'
                element={<CreateNewRecipe setShowNavbar={setShowNavbar}/>}
              />
              <Route
                path='recipes/:id'
                element={<SingleRecipe setShowNavbar={setShowNavbar}/>}
              />
              <Route
                path='recipes/:id/discussion'
                element={<Discussions setShowNavbar={setShowNavbar} role={currentUser.role}/>}
              />
              {/* ADDING VALIDATION TO ROUTE AND REDIRECTING IF USER ISNT LOGGED IN */}
              <Route
                path='recipes/:id/suggest-variation'
                element={<SuggestVariation setShowNavbar={setShowNavbar}/>}
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
                path='/all-users'
                element={<AllUserProfiles setShowNavbar={setShowNavbar} role={currentUser.role}/>}
              />
              <Route
                path='/my-profile'
                element={<UserProfile setShowNavbar={setShowNavbar}/>}
              />
              <Route
                path='/manage-recipes'
                element={<ControllRecipes setShowNavbar={setShowNavbar} role={currentUser.role} />}
              />
              <Route
                path='/terms-and-conditions'
                element={<TermsAndConditions setShowNavbar={setShowNavbar} />}
              />
              <Route
                path='/privacy-policy'
                element={<PrivacyPolicy setShowNavbar={setShowNavbar} />}
              />
              <Route 
                path='/*'
                element={<PageNotFound setShowNavbar={setShowNavbar}/>}
              />
          </Routes>
      </div>
    : 
    // NOTE: ROUTE HANDLING WHEN USER IS NOT LOGGED IN --------------------------------------------
      <div className="app-container">
          {showNavbar && <NavBar role={'user'}/>}
          <Routes>
              <Route
                path='/'
                element={<Home setShowNavbar={setShowNavbar}/>}
              />
              <Route 
                path='/recipes'
                element={<Recipe setShowNavbar={setShowNavbar} role={'user'}/>}
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
                path='/all-users'
                element={user ? <AllUserProfiles setShowNavbar={setShowNavbar}/> : <Navigate to={'/login'}/>}
              />
              <Route
                path='/my-profile'
                element={user ? <UserProfile setShowNavbar={setShowNavbar}/> : <Navigate to={'/login'}/>}
              />
              <Route
                path='/manage-recipes'
                element={user ? <ControllRecipes setShowNavbar={setShowNavbar}/> : <Navigate to={'/login'}/>}
              />
              <Route
                path='/terms-and-conditions'
                element={<TermsAndConditions setShowNavbar={setShowNavbar} />}
              />
              <Route
                path='/privacy-policy'
                element={<PrivacyPolicy setShowNavbar={setShowNavbar} />}
              />
              <Route 
                path='/*'
                element={<PageNotFound setShowNavbar={setShowNavbar}/>}
              />
          </Routes>
      </div>
    }
    </div>
  );
}

export default App;

// END OF DOCUMENT --------------------------------------------------------------------------------
