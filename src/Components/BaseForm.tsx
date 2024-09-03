import React, { useState, useEffect } from 'react';
import { Container, TextField, Typography, Box, Checkbox, FormControlLabel } from '@mui/material';
import { CustomButton, Switch } from './';

type FieldConfig<T> = {
    name: keyof T;
    label: string;
    type: string;
    required: boolean;
    validator?: (value: string | boolean) => string | null;
};

type BaseFormProps<T> = {
    fields: FieldConfig<T>[];
    initialValues: T;
    onSubmit: (values: T) => void;
    title: string;
    withCheckbox?: boolean;
    checkboxLabel?: string;
    withSwitch?: boolean;
    switchLabel?: string;
    withCancelButton?: boolean;
    buttonLabel?: string;
    onChange?: (values: T) => void;
    onCancel?: () => void; // New prop for handling cancel in modals
};

const BaseForm = <T extends Record<string, any>>({
    fields,
    initialValues,
    onSubmit,
    title,
    withCheckbox = false,
    checkboxLabel = 'Agree to terms',
    withSwitch = false,
    switchLabel = 'Enable feature',
    withCancelButton = true,
    buttonLabel = 'Submit',
    onChange,
    onCancel, // Add onCancel prop here
}: BaseFormProps<T>) => {
    const [formData, setFormData] = useState<T>(initialValues);
    const [errors, setErrors] = useState<Partial<Record<keyof T, string | null>>>({});
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        const allRequiredFilled = fields.every(field => 
            !field.required || (field.required && formData[field.name])
        );
        const isCheckboxValid = !withCheckbox || (withCheckbox && formData['agree']);
        setIsFormValid(allRequiredFilled && isCheckboxValid);
    }, [formData, fields, withCheckbox]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, type, checked, value } = event.target;
        const newValue = type === 'checkbox' ? checked : value;
        const updatedFormData = { ...formData, [name]: newValue };

        setFormData(updatedFormData);

        if (onChange) {
            onChange(updatedFormData); // Call the onChange prop if provided
        }

        const field = fields.find(f => f.name === name);
        if (field?.validator) {
            const error = field.validator(newValue);
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    };
    
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let isValid = true;
        let newErrors: Partial<Record<keyof T, string | null>> = {};
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
        if (onCancel) {
            onCancel(); // Use the onCancel prop if provided
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
                        key={field.name as string}
                        margin="normal"
                        required={field.required}
                        fullWidth
                        id={field.name as string}
                        label={field.label}
                        name={field.name as string}
                        type={field.type}
                        autoComplete={field.name as string}
                        value={formData[field.name] as string}
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
                
                <div style={{ display: 'flex', justifyContent: withCancelButton ? 'space-between' : 'center', marginTop: '30px' }}>
                    <CustomButton 
                        label={buttonLabel} 
                        onClick={handleSubmit} 
                        isActive={isFormValid} 
                        disabled={!isFormValid}
                    />
                    {withCancelButton && (
                        <CustomButton buttonType='cancelButton' label='Cancel' onClick={handleCancel} />
                    )}
                </div>
            </Box>
        </Container>
    );
};

export default BaseForm;
