import React from 'react';
import BaseForm from './BaseForm';

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

const handleLoginSubmit = (formData: Record<string, any>) => {
    console.log('Login Data:', formData);
    // TODO: Add Api call to login user
};

const LoginForm: React.FC<loginFormProps> = () => {

    return (
        <BaseForm
            fields={loginFields}
            initialValues={initialValues}
            onSubmit={handleLoginSubmit}
            title="Login"
            withSwitch={true}
            switchLabel="Request Admin Access"
        />
    );

}
 export default LoginForm;
