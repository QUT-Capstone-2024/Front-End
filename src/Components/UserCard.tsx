import React, { useState } from 'react';
import { UserWithId } from '../types';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { CustomModal } from '.';
import './UserCard.scss';

interface UserCardProps {
  user: UserWithId;
  onDelete: (id: number) => void;
  onUpdate: (id: number, updatedUser: Partial<UserWithId>) => void;
};

const UserCard: React.FC<UserCardProps> = ({ user, onDelete, onUpdate }) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  };

  const toggleDeleteModal = () => {
    setDeleteModalOpen(!deleteModalOpen);
  };

  const EditUserModalContent = () => {
    return (
      <div>
        {/* Edit user details form */}
      </div>
    );
  };

  const DeleteUserModalContent = () => {
    return (
      <div>
        {/* Delete user confirmation */}
      </div>
    );
  };


  return (
    <div style={{display: 'flex' }}>
      <div className='user-card-container'>
        <p>USER: {user.name}</p>
        <p>EMAIL: {user.email}</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '5px 10px', position: 'relative'}}>
        <EditIcon className={`edit-icon`} onClick={() => setEditModalOpen(true)} />
        <DeleteIcon className={`delete-icon`} onClick={() => setDeleteModalOpen(true)} />
      </div>



     <CustomModal
        modalType='editDetails'
        open={editModalOpen}
        onConfirm={() => console.log('clicked')}
        onClose={toggleEditModal}
      >
        <EditUserModalContent />
      </CustomModal>
     
     
     <CustomModal
        modalType='twoButton'
        open={deleteModalOpen}
        onConfirm={() => console.log('clicked')}
        onClose={toggleDeleteModal}
        label='Delete User'
      >
        <DeleteUserModalContent />
      </CustomModal>

    </div>
  );
};

export default UserCard;