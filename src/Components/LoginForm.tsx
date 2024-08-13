import React from 'react';
import { useNavigate } from 'react-router-dom';
import BaseForm from './BaseForm';
import { useDispatch } from 'react-redux';
import { login } from '../Redux/authSlice';
// TODO: Add a checkbox for requesting admin rights
type loginFormProps = {};

const loginFields = [
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'password', label: 'Password', type: 'password', required: true },  
];

const initialValues = {
    email: '',
    password: '',
};


const LoginForm: React.FC<loginFormProps> = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const handleLoginSubmit = (formData: Record<string, any>) => {
        // For testing purposes
        console.log('Login Data:', formData);
        dispatch(login());
        navigate('/Home');
        // TODO: Add Api call to login user
    };

    return (
        <>
        <BaseForm
            fields={loginFields}
            initialValues={initialValues}
            onSubmit={handleLoginSubmit}
            title=""
            withCancelButton={false}
            buttonLabel='Login' />
        </>
    );

}
 export default LoginForm;
