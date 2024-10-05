import React, { useEffect, useState } from "react";
import { BaseForm, CustomAlert } from "./index";
import { Link, useNavigate } from "react-router-dom";
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

const checkboxLabel = (
  // eslint-disable-next-line jsx-a11y/anchor-is-valid
  <a href="https://www.corelogic.com.au/legals/end-user-terms" target="_blank" rel="noreferrer">
    I agree to the terms and conditions
  </a>
);

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
        title="Register for an account"
        withCheckbox={true}
        checkboxLabel={checkboxLabel}
        buttonLabel="Register"
        onCancel={() => navigate('/')}
      />
    </div>
  );
};

export default RegisterForm;