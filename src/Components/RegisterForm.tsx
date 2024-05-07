import React, { useState } from 'react';
import { Container, TextField, Typography, Box } from '@mui/material';
import CustomButton from './Buttons';

type FormData = {
    id: string;
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    mobileNumber: string;
    userType: 'internalUser';
};

type FormErrors = {
    id?: string;
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    mobileNumber?: string;
};

const RegisterForm = () => {
    const [formData, setFormData] = useState<FormData>({
        id: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        mobileNumber: '',
        userType: 'internalUser'
    });

    const [errors, setErrors] = useState<FormErrors>({});

    const validate = () => {
        let tempErrors: FormErrors = {};
        if (!formData.id.trim()) tempErrors.id = 'User ID is required';
        if (!formData.name.trim()) tempErrors.name = 'Name is required';
         // Email validation
        if (!formData.email.trim()) {
          tempErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            tempErrors.email = 'Email is not valid';
        }
        // Password validation
        if (formData.password.length < 10) {
          tempErrors.password = 'Password must be at least 10 characters long';
        } else if (!/(?=.*[!@#$%^&*])(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{10,}/.test(formData.password)) {
            tempErrors.password = 'Password must contain at least 10 characters, one special character, one number, one uppercase letter, and one lowercase letter';
        }
        if (formData.confirmPassword !== formData.password) tempErrors.confirmPassword = 'Passwords must match';
        // Optional fields do not necessarily need validation
        return tempErrors;
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let tempErrors = validate();
        if (Object.keys(tempErrors).length === 0) {
            console.log('Form Data:', formData);
            //TODO: Send form data to server
        } else {
            setErrors(tempErrors);
        }
    };

    return (
        <Container component="main" maxWidth="sm">
            <Typography component="h1" variant="h5" sx={{ mt: 2, mb: 2 }}>
                Register
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                {Object.entries(formData).map(([key, value]) => (
                    key !== 'userType' && (
                        <TextField
                            key={key}
                            margin="normal"
                            required={key !== 'mobileNumber'}
                            fullWidth
                            id={key}
                            label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                            name={key}
                            type={key.includes('password') ? 'password' : 'text'}
                            autoComplete={key}
                            value={value}
                            onChange={handleChange}
                            error={!!errors[key as keyof FormErrors]}
                            helperText={errors[key as keyof FormErrors]}
                        />
                    )
                ))}
                <CustomButton label='submit' onClick={handleSubmit}/>
            </Box>
        </Container>
    );
};

export default RegisterForm;