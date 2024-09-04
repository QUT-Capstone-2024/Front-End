import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';

export enum AuthLevels {
    CL_ADMIN = 4, 
    CL_USER = 3, 
    PROPERTY_VALUER = 2,
    PROPERTY_OWNER = 1, 
    GUEST = 0 
};

interface ProtectedRouteProps {
    requiredAuthLevel: number;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredAuthLevel }) => {
    const loggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
    const getAuthLevel = (userType: string | undefined ) => {
        switch (userType) {
            case 'CL_ADMIN':
                return AuthLevels.CL_ADMIN;
            case 'CL_USER':
                return AuthLevels.CL_USER;
            case 'PROPERTY_VALUER':
                return AuthLevels.PROPERTY_VALUER;
            case 'PROPERTY_OWNER':
                return AuthLevels.PROPERTY_OWNER;
            default:
                return AuthLevels.GUEST;
        }
    };

    const userType = useSelector((state: RootState) => state.user.userDetails?.userType);
    const authLevel = getAuthLevel(userType);

    if (!loggedIn || authLevel < requiredAuthLevel) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
