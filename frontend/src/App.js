import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import PageNotFound from './pages/PageNotFound';
import Recipe from './pages/Recipe';
import CreateNewRecipe from './components/CreateNewRecipe';

function App() {
  return (
    <div className="app-container">
        <Routes>
            <Route
              path='/'
              element={<Home />}
            />
            <Route 
              path='/recipes'
              element={<Recipe />}
            />
            <Route
              path='/newrecipe'
              element={<CreateNewRecipe />}
            />
            <Route 
              path='/login'
              element={<Login />}
            />
            <Route 
              path='/*'
              element={<PageNotFound />}
            />
        </Routes>
    </div>
  );
}

export default App;
