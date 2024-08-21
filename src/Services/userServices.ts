const API_URL = 'http://localhost:8080/api';

interface User {
    email: string;
    password: string;
}

// Existing login function
export const login = async ({ email, password }: User): Promise<any> => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        throw new Error('Failed to login');
    }

    const data = await response.json();
    return data;
};

// New register function
interface RegisterUser {
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
    userType: string;
    userRole: string;
    propertyIds: number[]; // or string[] depending on your setup
}

export const register = async (user: RegisterUser): Promise<any> => {
    const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Failed to register');
    }

    const data = await response.json();
    return data;
};
