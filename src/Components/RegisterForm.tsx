import React, { useEffect, useState } from "react";
import { BaseForm, CustomAlert } from "./index";
import { useNavigate } from "react-router-dom";
import { register } from '../Services';


type RegisterFormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  propertyIds: number[];
};


type FieldConfig<T> = {
  name: keyof T;
  label: string;
  type: string;
  required: boolean;
  validator?: (value: string | boolean) => string | null;
};


const registerFields: FieldConfig<RegisterFormData>[] = [
  { name: "username", label: "User Name", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "password", label: "Password", type: "password", required: true },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    required: true,
  },
  { name: "phoneNumber", label: "Phone Number", type: "text", required: true },
];


const initialValues: RegisterFormData = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  phoneNumber: "",
  propertyIds: [],
};

const RegisterForm: React.FC = () => {
  const [errors, setErrors] = useState<React.ReactNode | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showAlert) {
      timer = setTimeout(() => {
        setShowAlert(false);
        setErrors(null);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showAlert]);

  const handleRegisterSubmit = async (formData: RegisterFormData) => {
    if (formData.password !== formData.confirmPassword) {
      setShowAlert(true);
      setErrors("Passwords do not match. Please try again.");
      return;
    }

    try {
      const data = await register({
        name: formData.username,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        userType: "PROPERTY_OWNER",
        userRole: "EXTERNAL",
        propertyIds: formData.propertyIds,
      });

      console.log("Registration successful:", data);
      navigate("/");
    } catch (error) {
      console.error("Registration failed:", error);
      setShowAlert(true);
      setErrors("Registration failed. Please try again.");
    }
  };

  return (
    <div>
      <CustomAlert message={errors} type="error" isVisible={showAlert} />

      <BaseForm<RegisterFormData>
        fields={registerFields}
        initialValues={initialValues}
        onSubmit={handleRegisterSubmit}
        title="Register"
        withCheckbox={true}
        checkboxLabel="I agree to the terms and conditions."
        withSwitch={true}
        switchLabel="Request Admin Access"
        buttonLabel="Register"
      />
    </div>
  );
};

export default RegisterForm;



/////////////////////////// TO DO ///////////////////////////
// Create functionality for the Request Admin Access switch - this is only available to internal users so may actually need to be moved to the login page instead
// Add validations for the fields
// Add the T&C's