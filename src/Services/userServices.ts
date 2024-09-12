import { API_URL } from '../config/config';
import { UpdateUser, UserWithId } from '../types';

export const getUserById = async (id: number, token: string): Promise<UserWithId> => {
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Failed to fetch user');
    }

    const data = await response.json();
    return data;
};

export const getAllUsers = async (token: string): Promise<any[]> => {
    const response = await fetch(`${API_URL}/users/all`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }

    const data = await response.json();
    return data;
};

export const updateUser = async (id: number, user: UpdateUser, token: string): Promise<any> => {
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(user),
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Failed to update user');
    }

    const data = await response.json();
    return data;
};

export const deleteUser = async (id: number, token: string): Promise<any> => {
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Failed to delete user');
    }

    return { message: 'User deleted successfully' };
};

export const archiveUser = async (id: number, token: string): Promise<any> => {
    const response = await fetch(`${API_URL}/users/archive/${id}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Failed to archive user');
    }

    return { message: 'User archived successfully' };
};



