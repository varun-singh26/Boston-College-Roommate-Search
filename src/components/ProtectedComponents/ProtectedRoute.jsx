import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext/index" //import the authenitcation context

const ProtectedRoute = ({children}) => {
    const { userLoggedIn } = useContext(AuthContext);

    if (!userLoggedIn) {
        //Redirect to the login page if the user isn't logged in
        return <Navigate to="/login" />;
    }

    //Render the child component if user is logged in
    return children;
};

export default ProtectedRoute;