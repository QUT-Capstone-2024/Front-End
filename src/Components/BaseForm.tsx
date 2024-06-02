import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Typography, Box, Checkbox, FormControlLabel } from '@mui/material';
import { CustomButton, Switch } from './';

type FieldConfig = {
    name: string;
    label: string;
    type: string;
    required: boolean;
    validator?: (value: string | boolean) => string | null;
};

type BaseFormProps = {
    fields: FieldConfig[];
    initialValues: Record<string, any>;
    onSubmit: (values: Record<string, any>) => void;
    title: string;
    withCheckbox?: boolean;
    checkboxLabel?: string;
    withSwitch?: boolean;
    switchLabel?: string;
};

const BaseForm: React.FC<BaseFormProps> = ({
    fields,
    initialValues,
    onSubmit,
    title,
    withCheckbox = false,
    checkboxLabel = 'Agree to terms',
    withSwitch = false,
    switchLabel = 'Enable feature'
}) => {
    const [formData, setFormData] = useState<Record<string, any>>(initialValues);
    const [errors, setErrors] = useState<Record<string, string | null>>({});
    const navigate = useNavigate();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, type, checked, value } = event.target;
        const newValue = type === 'checkbox' ? checked : value;
        setFormData(prev => ({ ...prev, [name]: newValue }));
        
        // Check for field validator
        const field = fields.find(f => f.name === name);
        if (field?.validator) {
            const error = field.validator(newValue);
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

    const handleCancel = () => {
        setFormData(initialValues);
        setErrors({});
        navigate('/');
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

                {withSwitch &&
                    <div style={{ marginTop: '30px' }}>
                        <Typography variant="body1" gutterBottom>{switchLabel}</Typography>
                        <Switch checked={!!formData['switch']} onChange={handleChange} name="switch" />
                    </div>
                }

                {withCheckbox &&
                    <FormControlLabel
                        control={<Checkbox checked={!!formData['agree']} onChange={handleChange} name="agree" />}
                        label={checkboxLabel}
                        sx={{ marginTop: '30px' }}
                        required
                    />
                }
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
                    <CustomButton label='Submit' onClick={handleSubmit} disabled={(withCheckbox && !formData['agree'])} />
                    <CustomButton buttonType='cancelButton' label='Cancel' onClick={handleCancel} />
                </div>
            </Box>
        </Container>
    );
};

export default BaseForm;