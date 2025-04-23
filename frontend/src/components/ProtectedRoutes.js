// IMPORTS ----------------------------------------------------------------------------------------
import { Navigate } from 'react-router-dom';
import AuthService from '../services/authService';

// PROTECTED ROUTE FUNCTION -----------------------------------------------------------------------
const ProtectedRoute = ({ children }) => {
    if (!AuthService.isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute; 

// END OF DOCUMENT --------------------------------------------------------------------------------