import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useCheckAuth } from '../Hooks/useCheckAuth';

interface ProtectedRouteProps {
    requiredAuthLevel: number;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredAuthLevel }) => {
    // Using the useCheckAuth hook to get the loggedIn, authLevel, and userType
    const { loggedIn, authLevel } = useCheckAuth();

    // Redirect to the unauthorized page if the user is not logged in or does not meet the required auth level
    if (!loggedIn || authLevel < requiredAuthLevel) {
        return <Navigate to="/unauthorized" replace />;
    }

    // Render the child routes/components if the user meets the required auth level
    return <Outlet />;
};

export default ProtectedRoute;
