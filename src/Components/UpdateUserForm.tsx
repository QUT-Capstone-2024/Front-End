import React, { useState, useEffect } from "react";
import { BaseForm, CustomAlert } from "./index";
import { updateUser } from "../Services";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { UserWithId } from "../types";
import { useCheckAuth } from "../Hooks/useCheckAuth";

// Define the type for the form data
type UpdateFormData = {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phoneNumber?: string;
  propertyIds?: number[];
  userType?: string;
  userRole?: string;
};

// Define the type for the form fields configuration
type FieldConfig<T> = {
  name: keyof T;
  label: string;
  type: string;
  required: boolean;
  validator?: (value: string | boolean) => string | null;
};

// Define the form fields for regular users 
const UpdateFields: FieldConfig<UpdateFormData>[] = [
  { name: "username", label: "User Name", type: "text", required: false },
  { name: "email", label: "Email", type: "email", required: false },
  {
    name: "password",
    label: "New Password",
    type: "password",
    required: false,
  },
  {
    name: "confirmPassword",
    label: "Confirm New Password",
    type: "password",
    required: false,
  },
  { name: "phoneNumber", label: "Phone Number", type: "text", required: false },
];

// Define the form fields for admin users
const adminFields: FieldConfig<UpdateFormData>[] = [
  { name: "userType", label: "User Type", type: "text", required: false },
  { name: "userRole", label: "User Role", type: "text", required: false },
];

// Define the UpdateForm component
const UpdateForm: React.FC<{
  user: UserWithId;
  onUpdate: (id: number, updatedUser: Partial<UserWithId>) => void;
  onCancel: () => void;
}> = ({ user, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState<UpdateFormData>({
    username: user.name,
    email: user.email,
    password: "",
    confirmPassword: "",
    phoneNumber: user.phoneNumber,
    propertyIds: user.propertyIds || [],
    userType: user.userType,
    userRole: user.userRole,
  });
  const [errors, setErrors] = useState<React.ReactNode | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const token = useSelector((state: RootState) => state.user.token);

  const { isAdmin } = useCheckAuth();

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

  // Handle input changes in the form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
      ...(name === "userType" && {
        userRole: value.startsWith("CL") ? "INTERNAL" : "EXTERNAL",
      }),
    }));
  };

  // Handle form submission
  const handleUpdateSubmit = async () => {
    console.log("Form data on submit:", formData);
    if (formData.password && formData.password !== formData.confirmPassword) {
      setShowAlert(true);
      setErrors("Passwords do not match. Please try again.");
      return;
    }

    const updatedUser: Partial<UserWithId> = {
      name: formData.username || user.name,
      email: formData.email || user.email,
      password: formData.password ? formData.password : undefined,
      phoneNumber: formData.phoneNumber || user.phoneNumber,
      userType: isAdmin ? formData.userType || user.userType : undefined,
      userRole: isAdmin ? formData.userRole || user.userRole : undefined,
      propertyIds: formData.propertyIds || [],
    };

    try {
      if (token) {
        await updateUser(user.id, updatedUser, token);
        console.log("Update successful");
        onUpdate(user.id, updatedUser);
        onCancel(); // Close the modal after a successful update
      }
    } catch (error) {
      console.error("Update failed:", error);
      setShowAlert(true);
      setErrors("Update failed. Please try again.");
    }
  };
  
  return (
    <div>
      <CustomAlert message={errors} type="error" isVisible={showAlert} />
      <BaseForm<UpdateFormData>
        title='Update User'
        fields={isAdmin ? [...UpdateFields, ...adminFields] : UpdateFields}
        initialValues={formData}
        onSubmit={handleUpdateSubmit}
        onChange={(updatedFormData) => setFormData(updatedFormData)} // Handles form data updates
        buttonLabel="Update"
        onCancel={onCancel} // Pass the onCancel function
      />
    </div>
  );
};

export default UpdateForm;
