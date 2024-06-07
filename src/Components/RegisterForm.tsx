import React, { useEffect, useState } from "react";
import { BaseForm, CustomAlert } from "./index";
import { useNavigate } from "react-router-dom";

// TODO: Check if the user already exists - this is the email address being unique
// TODO: Error on insecure password
// TODO: Link to terms and conditions
// TODO: Add data controls for the admin switch
type registerFormProps = {};

const registerFields = [
  { name: "username", label: "User Name", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "password", label: "Password", type: "password", required: true },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    required: true,
  },
];

const initialValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const RegisterForm: React.FC<registerFormProps> = () => {
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

  const handleRegisterSubmit = (formData: Record<string, any>) => {
    if (formData.password !== formData.confirmPassword) {
      setShowAlert(true);
      setErrors("Passwords do not match. Please try again.");
      formData.confirmPassword = "";
      return;
    }

    // For testing purposes
    console.log("Registration Data:", formData);
    navigate("/login");
    // TODO: Add Api call to register user
  };

  return (
    <div>
      <CustomAlert
        message={errors}
        type="error"
        isVisible={showAlert}
      />

      <BaseForm
        fields={registerFields}
        initialValues={initialValues}
        onSubmit={handleRegisterSubmit}
        title="Register"
        withCheckbox={true}
        checkboxLabel="I agree to the terms and conditions."
        withSwitch={true}
        switchLabel="Request Admin Access"
      />
    </div>
  );
};
export default RegisterForm;
