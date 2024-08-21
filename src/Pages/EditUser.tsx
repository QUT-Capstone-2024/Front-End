import React, { useState } from "react";
import { Spacer, CustomButton } from "../Components";  
import Modal from "../Components/Modal";
import { Card, Box } from "@mui/material";

interface User {
  id: number;
  userType: string;
  userRole: string;
  ownedProperties: number[];
  creationTime: Date;
  email: string;
  username: string;
  phoneNumber: string;
}

const EditUser: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      userType: "Standard",
      userRole: "User",
      ownedProperties: [1, 2],
      creationTime: new Date(),
      email: "john@example.com",
      username: "john_doe",
      phoneNumber: "123-456-7890",
    },
    {
      id: 2,
      userType: "Admin",
      userRole: "Administrator",
      ownedProperties: [3],
      creationTime: new Date(),
      email: "jane@example.com",
      username: "jane_doe",
      phoneNumber: "987-654-3210",
    }
  ]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUserType, setNewUserType] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleUserTypeChange = (user: User, newType: string) => {
    setSelectedUser(user);
    setNewUserType(newType);
    setShowModal(true);
  };

  const confirmChange = () => {
    if (selectedUser) {
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, userType: newUserType } : u));
    }
    setShowModal(false);
  };

  return (
    <Box 
      sx={{
        padding: '20px',
        maxWidth: '900px',  
        margin: '20px auto 0',  
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}
    >
      <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#0a3d62' }}>Edit Users</h1>
      <Spacer height={2} />
      {users.map(user => (
        <Card 
          key={user.id} 
          sx={{
            marginBottom: '20px', 
            padding: '20px',
            borderRadius: '8px',
            backgroundColor: '#f1f2f6',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <h2 style={{ margin: '0', color: '#0a3d62' }}>{user.username}</h2>
            <p style={{ margin: '5px 0', color: '#576574' }}>{user.email}</p>
          </div>
          <select 
            value={user.userType} 
            onChange={(e) => handleUserTypeChange(user, e.target.value)}
            style={{
              padding: '10px', 
              borderRadius: '4px', 
              border: '1px solid #ccc',
              backgroundColor: '#fff',
              color: '#0a3d62'
            }}
          >
            <option value="Admin">Admin</option>
            <option value="Standard">Standard</option>
          </select>
        </Card>
      ))}

      {showModal && (
        <Modal 
          open={showModal} 
          onClose={() => setShowModal(false)} 
          onConfirm={confirmChange}
          modalType="twoButton"
          label="Confirm User Type Change"
        >
          <p style={{ textAlign: 'center', color: '#333' }}>
            This action will change <strong>{selectedUser?.username}</strong>'s user type to <strong>{newUserType}</strong>. 
            Are you sure?
          </p>
        </Modal>
      )}

      <Spacer height={2} />
      <CustomButton 
        label="Save Changes" 
        buttonType="successButton" 
        onClick={() => console.log('Changes saved')}
        style={{ width: '100%', padding: '15px', marginTop: '20px', backgroundColor: '#0a3d62', color: '#fff' }}
      />
    </Box>
  );
};

export default EditUser;
