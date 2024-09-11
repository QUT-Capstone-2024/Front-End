import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';
import { AuthLevels } from '../Constants/AuthLevels';

export const useCheckAuth = () => {
    // Get logged-in status and userType from the global state (Redux)
    const loggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
    const userType = useSelector((state: RootState) => state.user.userDetails?.userType);

    // Map userType string to the corresponding enum number from AuthLevels
    const authLevel = AuthLevels[userType as keyof typeof AuthLevels] ?? AuthLevels.GUEST;

    // Determine if the user is an admin (CL_ADMIN or HARBINGER)
    const isAdmin = authLevel === AuthLevels.CL_ADMIN || authLevel === AuthLevels.HARBINGER;

    // Return the values that can be used anywhere
    return { loggedIn, authLevel, isAdmin, userType };
};
