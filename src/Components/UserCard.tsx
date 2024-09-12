import React, { useState } from 'react';
import { UserWithId } from '../types';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { CustomModal, UpdateForm } from '.';
import '../Styles/Cards.scss';
import ArchiveIcon from '@mui/icons-material/Archive';
import { useCheckAuth } from '../Hooks/useCheckAuth';

interface UserCardProps {
  user: UserWithId;
  onDelete: (id: number) => void;
  onUpdate: (id: number, updatedUser: Partial<UserWithId>) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onDelete, onUpdate }) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { userType } = useCheckAuth();
  const isGod = userType === 'HARBINGER';

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  };

  const toggleDeleteModal = () => {
    setDeleteModalOpen(!deleteModalOpen);
  };

  const DeleteUserModalContent = () => {
    return (
      isGod ?
        <div>
          Are you sure you want to delete {user.name}?
        </div>
      :
        <div>
          Are you sure you want to archive {user.name}?
        </div>
    );
  };

  return (
    <div style={{display: 'flex' }}>
      <div className='user-card-container'>
        <div style={{ display: 'flex', flexDirection: 'column'}}>
          <p><span style={{ fontWeight: 'bold' }}>USER:</span> {user.name}</p>
          <p><span style={{ fontWeight: 'bold' }}>EMAIL:</span> {user.email}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', paddingRight: '15px', position: 'relative'}}>
          <EditIcon className={`edit-icon`} onClick={() => setEditModalOpen(true)} />
          {isGod ?
            <DeleteIcon className={`delete-icon`} onClick={() => setDeleteModalOpen(true)} />
            :
            <ArchiveIcon className={`delete-icon`} onClick={() => setDeleteModalOpen(true)} />
          }
        </div>
      </div>

      <CustomModal
        modalType='editDetails'
        open={editModalOpen}
        onConfirm={() => onUpdate(user.id, { name: 'new name', email: 'new email' })}
        onClose={toggleEditModal}
      >
        <UpdateForm user={user} onUpdate={onUpdate} onCancel={toggleEditModal} />
      </CustomModal>

      <CustomModal
        modalType='twoButton'
        buttonType='errorButton'
        open={deleteModalOpen}
        onConfirm={() => onDelete(user.id)}
        onClose={toggleDeleteModal}
        title={isGod ? 'Delete User' : 'Archive User'} 
        contentColour='#ef4400' 
      >
        <DeleteUserModalContent />
      </CustomModal>
    </div>
  );
};

export default UserCard;
