import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext/index.jsx"; 

const ProtectedRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();
    const location = useLocation();

    console.log("🔒 ProtectedRoute - CurrentUser:", currentUser);
    console.log("⏳ ProtectedRoute - Loading:", loading);

    if (loading) return <h2>Loading...</h2>;

    // Redirect authenticated users away from the sign-in page
    if (currentUser && location.pathname === "/signin-wall") {
        return <Navigate to="/" replace />;
    }

    // Allow access to protected content if authenticated
    return currentUser ? children : <Navigate to="/signin-wall" replace />;
};

export default ProtectedRoute;
