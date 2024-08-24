import React, { useState } from "react";
import { Spacer, CustomButton } from "../Components";  
import Modal from "../Components/Modal";
import { Card, CardContent, Box } from "@mui/material";

// TESTING 
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
      userType: "User",  
      userRole: "User",
      ownedProperties: [1, 2],
      creationTime: new Date(),
      email: "user@example.com",
      username: "USER",
      phoneNumber: "123-456-7890",
    },
    {
      id: 2,
      userType: "Admin",
      userRole: "Administrator",
      ownedProperties: [3],
      creationTime: new Date(),
      email: "admin@example.com",
      username: "ADMIN",
      phoneNumber: "987-654-3210",
    }
  ]);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUserType, setNewUserType] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleUserTypeChange = (user: User, newType: string) => {
    setSelectedUser(user);
    setNewUserType(newType.toUpperCase());  
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
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e2eaf1',  
        paddingTop: '1px',
        marginTop: '30px',
        marginBottom: '50px',
      }}
    >
      <Card 
        sx={{
          width: '90%',  
          maxWidth: '600px',  
          padding: '20px',
          borderRadius: '8px',
          backgroundColor: '#eff7fe',  
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}
      >
        <CardContent>
          <h1 style={{ textAlign: 'center', marginBottom: '10px', marginTop: '0px', color: '#0a3d62' }}>EDIT USERS</h1> 
          <Spacer height={1} /> 
          {users.map(user => (
            <Card 
              key={user.id} 
              sx={{
                marginBottom: '20px', 
                padding: '20px',
                borderRadius: '8px',
                backgroundColor: '#ffffff',  
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <h2 style={{ margin: '0', color: '#0a3d62', textAlign: 'left' }}>{user.username}</h2>  
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
                  color: '#0a3d62',
                }}
              >
                <option value="Admin">ADMIN</option>
                <option value="User">USER</option>  
              </select>
            </Card>
          ))}

          {showModal && (
            <Modal 
              open={showModal} 
              onClose={() => setShowModal(false)} 
              onConfirm={confirmChange}
              label="CONFIRM USER TYPE CHANGE"
            >
              <p style={{ textAlign: 'center', color: '#333' }}>
                This action will change <strong>{selectedUser?.username}</strong>'s user type to <strong>{newUserType}</strong>. 
                <br/><br/> 
                Are you sure?
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                <CustomButton 
                  label="CONFIRM USER TYPE CHANGE" 
                  buttonType="warningButton"
                  onClick={confirmChange} 
                />
                <CustomButton 
                  label="CANCEL" 
                  buttonType="cancelButton" 
                  onClick={() => setShowModal(false)} 
                />
              </div>
            </Modal>
          )}

          <Spacer height={2} />
          <CustomButton 
            label="Save Changes" 
            buttonType="successButton" 
            onClick={() => console.log('Changes saved')}
            style={{ width: '30%', padding: '15px', marginTop: '20px', backgroundColor: '#0a3d62', color: '#fff', marginLeft: 'auto', marginRight: 'auto', display: 'block' }}  
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default EditUser;
