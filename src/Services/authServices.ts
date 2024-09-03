import { API_URL } from '../config/config';
import { User, RegisterUser } from '../types';


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