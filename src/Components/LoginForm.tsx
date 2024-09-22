import React from 'react';
import { useNavigate } from 'react-router-dom';
import BaseForm from './BaseForm';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../Hooks/useAppDispatch';
import { login } from '../Redux/Slices/userSlice';
import { RootState } from '../Redux/store';


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
    const userState = useSelector((state: RootState) => state.user);
    
    const handleLoginSubmit = async (formData: LoginFormData) => {
        try {
            await dispatch(login(formData)).unwrap();
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
                title="Login with your credentials"
                withCancelButton={false}
                buttonLabel="Login"
            />
            {userState.loading && <p>Loading...</p>}
            {userState.error && <p style={{ color: 'red' }}>{userState.error}</p>}
        </>
    );
};

export default LoginForm;
