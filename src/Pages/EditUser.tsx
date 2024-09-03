import React, { useEffect, useState } from 'react';
import { getAllUsers, deleteUser, updateUser } from '../Services';
import { UserWithId } from '../types';
import { RootState } from '../Redux/store';
import { useSelector } from 'react-redux';
import { UserCard } from '../Components';

const UsersPage: React.FC = () => {
    const token = useSelector((state: RootState) => state.user.token);
    const [users, setUsers] = useState<UserWithId[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch users when the component mounts
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const data = await getAllUsers();
                setUsers(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch users');
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (id: number) => {
      if (!token) {
          console.error('No token found, please log in.');
          // Optionally, redirect to login or show an error message
          return;
      }
  
      try {
          await deleteUser(id, token);
          // Refresh the users list after deletion
      } catch (error) {
          console.error(error);
      }
  };
  
  const handleUpdate = async (id: number, updatedUser: Partial<UserWithId>) => {
      if (!token) {
          console.error('No token found, please log in.');
          // Optionally, redirect to login or show an error message
          return;
      }
  
      try {
          await updateUser(id, updatedUser, token);
          // Refresh the users list after update
      } catch (error) {
          console.error(error);
      }
  };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className='page-container' style={{ display: 'flex',  justifyContent: 'center', marginTop: '4rem'}}>
            <div className='users-container' style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {users.map(user => (
                    <div key={user.id}>
                        <UserCard user={user} onDelete={handleDelete} onUpdate={handleUpdate}/>      
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UsersPage;
