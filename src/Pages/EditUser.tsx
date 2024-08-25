import React, { useState } from "react";
import { Spacer, CustomButton, SearchBar } from "../Components"; 
import Modal from "../Components/Modal";
import { Card, CardContent, Box, IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';  // Import the edit icon

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
      userType: "STANDARD",  
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
    },
    {
      id: 3,
      userType: "STANDARD",  
      userRole: "User",
      ownedProperties: [],
      creationTime: new Date(),
      email: "anotheruser@example.com",
      username: "ANOTHERUSER",
      phoneNumber: "111-222-3333",
    },
    {
      id: 4,
      userType: "Admin",
      userRole: "Administrator",
      ownedProperties: [4],
      creationTime: new Date(),
      email: "anotheradmin@example.com",
      username: "ANOTHERADMIN",
      phoneNumber: "444-555-6666",
    },
    {
      id: 5,
      userType: "STANDARD",  
      userRole: "User",
      ownedProperties: [5],
      creationTime: new Date(),
      email: "yetanotheruser@example.com",
      username: "YETANOTHERUSER",
      phoneNumber: "777-888-9999",
    }
  ]);

  const [filteredUsers, setFilteredUsers] = useState(users);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUserType, setNewUserType] = useState<string>("");

  const handleUserTypeChange = (user: User, newType: string) => {
    setSelectedUser(user);
    setNewUserType(newType);
    setShowModal(true);
  };

  const confirmChange = () => {
    if (selectedUser) {
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, userType: newUserType.toUpperCase() } : u));
      setShowModal(false);
    }
  };

  const handleSearch = (query: string) => {
    const result = users.filter(user =>
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(result);
  };

  const saveChanges = () => {
    console.log('User types updated', users);
  };

  const handleEditUser = (user: User) => {
    // Logic for opening the edit user modal or navigating to the edit user page
    console.log(`Editing user: ${user.username}`);
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
          {/* Title */}
          <h1 style={{ textAlign: 'center', color: '#0a3d62', fontSize: '2rem', margin: '0' }}>
            USER MANAGEMENT
          </h1>

          {/* Centered Search Bar */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '20px' }}>
            <SearchBar placeholder="Search" onSearch={handleSearch} />
          </div>

          <Spacer height={1} /> 
          {filteredUsers.map(user => (
            <Card 
              key={user.id} 
              sx={{
                marginBottom: '20px', 
                padding: '20px',
                borderRadius: '8px',
                backgroundColor: '#eff7fe',  
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)', 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <IconButton 
                  onClick={() => handleEditUser(user)} 
                  sx={{ marginRight: '10px', color: '#0a3d62' }} 
                >
                  <EditIcon />
                </IconButton>
                <div>
                  <h2 style={{ margin: '0', color: '#333', textAlign: 'left' }}>{user.username}</h2>  
                  <p style={{ margin: '5px 0', color: '#576574' }}>{user.email}</p>
                </div>
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
                <option value="STANDARD">STANDARD</option>  
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
                This action will change <strong>{selectedUser?.username}</strong>'s user type to <strong>{newUserType.toUpperCase()}</strong>. 
                <br/><br/> 
                Are you sure?
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                <CustomButton 
                  label="CONFIRM" 
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
            label="SAVE CHANGES" 
            buttonType="warningButton" 
            onClick={saveChanges}
            style={{ width: '30%', padding: '15px', marginTop: '20px', marginLeft: 'auto', marginRight: 'auto', display: 'block' }}  
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default EditUser;
