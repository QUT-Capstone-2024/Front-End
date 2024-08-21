import React from 'react';
import { useNavigate } from 'react-router-dom';
import BaseForm from './BaseForm';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../Hooks/useAppDispatch';
import { login } from '../Redux/authSlice';
import { RootState } from '../store';

interface LoginFormData {
    email: string;
    password: string;
}

type FieldConfig<T> = {
    name: keyof T;
    label: string;
    type: string;
    required: boolean;
    validator?: (value: string | boolean) => string | null;
};

const loginFields: FieldConfig<LoginFormData>[] = [
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'password', label: 'Password', type: 'password', required: true },  
];

const initialValues: LoginFormData = {
    email: '',
    password: '',
};

const LoginForm: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const authState = useSelector((state: RootState) => state.auth);
    
    const handleLoginSubmit = async (formData: LoginFormData) => {
        try {
            const token = await dispatch(login(formData)).unwrap();
            // Save the token to localStorage or state management if needed
            localStorage.setItem('token', token);
            navigate('/Home');
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Please check your credentials and try again.');
        }
    };

    return (
        <>
            <BaseForm<LoginFormData>
                fields={loginFields}
                initialValues={initialValues}
                onSubmit={handleLoginSubmit}
                title="Login"
                withCancelButton={false}
                buttonLabel="Login"
            />
            {authState.loading && <p>Loading...</p>}
            {authState.error && <p style={{ color: 'red' }}>{authState.error}</p>}
        </>
    );
};

export default LoginForm;
