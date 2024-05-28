import React, { useState } from 'react';
import { Container, TextField, Typography, Box } from '@mui/material';
import CustomButton from './Buttons';
import { isNullOrUndefined } from 'util';

type FieldConfig = {
    name: string;
    label: string;
    type: string;
    required: boolean;
    validator?: (value: string) => string | null;
};

type BaseFormProps = {
    fields: FieldConfig[];
    initialValues: Record<string, any>;
    onSubmit: (values: Record<string, any>) => void;
    title: string;
};

const BaseForm: React.FC<BaseFormProps> = ({ fields, initialValues, onSubmit, title }) => {
    const [formData, setFormData] = useState<Record<string, any>>(initialValues);
    const [errors, setErrors] = useState<Record<string, string | null>>({});

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (fields.find(f => f.name === name)?.validator) {
            const error = fields.find(f => f.name === name)?.validator!(value) ?? null;
            setErrors(prev => ({ ...prev, [name]: error }));
            
        }
    };
    
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let isValid = true;
        let newErrors: Record<string, string | null> = {};
        fields.forEach(field => {
            const value = formData[field.name];
            if (field.validator) {
                const error = field.validator(value);
                if (error) {
                    isValid = false;
                    newErrors[field.name] = error;
                }
            }
        });
        setErrors(newErrors);
        if (isValid) {
            onSubmit(formData);
        }
    };

    return (
        <Container component="main" maxWidth="sm">
            <Typography component="h1" variant="h5" sx={{ mt: 2, mb: 2 }}>
                {title}
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                {fields.map(field => (
                    <TextField
                        key={field.name}
                        margin="normal"
                        required={field.required}
                        fullWidth
                        id={field.name}
                        label={field.label}
                        name={field.name}
                        type={field.type}
                        autoComplete={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        error={!!errors[field.name]}
                        helperText={errors[field.name]}
                    />
                ))}
                <CustomButton label='Submit' onClick={handleSubmit} />
            </Box>
        </Container>
    );
};

export default BaseForm;
