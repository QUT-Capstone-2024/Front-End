import React, { useEffect, useState } from 'react';
import { getAllUsers, deleteUser, updateUser } from '../Services';
import { UserWithId } from '../types';
import { RootState } from '../Redux/store';
import { useSelector } from 'react-redux';
import { UserCard, SearchBar, Spacer } from '../Components';
import RefreshIcon from '@mui/icons-material/Refresh';
import IconButton from '@mui/material/IconButton';

const UsersPage: React.FC = () => {
    const token = useSelector((state: RootState) => state.user.token);
    const [users, setUsers] = useState<UserWithId[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UserWithId[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await getAllUsers();
            setUsers(data);
            setFilteredUsers(data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch users');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Filter users based on search term in real-time
    useEffect(() => {
        if (searchTerm === '') {
            setFilteredUsers(users);
        } else {
            const filtered = users.filter((user) => {
                const nameMatch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
                const emailMatch = user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
                return nameMatch || emailMatch;
            });
            setFilteredUsers(filtered);
        }
    }, [searchTerm, users]);

    const handleDelete = async (id: number) => {
        if (!token) {
            console.error('No token found, please log in.');
            return;
        }

        try {
            await deleteUser(id, token);
            await fetchUsers(); // Refresh the users list after deletion
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdate = async (id: number, updatedUser: Partial<UserWithId>) => {
        if (!token) {
            console.error('No token found, please log in.');
            return;
        }

        try {
            await updateUser(id, updatedUser, token);
            await fetchUsers(); // Refresh the users list after update
        } catch (error) {
            console.error(error);
        }
    };

    const handleSearch = (term: string) => {
        setSearchTerm(term);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className='page-container' 
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '4rem', marginLeft: '20%'}}
        >
            <div style={{ maxWidth: '430px'}}>
                <h2 style={{ textAlign: 'start' }}>Edit Users</h2>
                <Spacer height={1} />
                <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                    <SearchBar onSearch={handleSearch} placeholder='Find a user ...'/>
                    <IconButton onClick={fetchUsers}>
                        <RefreshIcon className='refresh-icon'/>
                    </IconButton>
                </div>
                <Spacer height={1} />
                <div className='users-container' style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {filteredUsers.map(user => (
                        <div key={user.id}>
                            <UserCard user={user} onDelete={handleDelete} onUpdate={handleUpdate}/>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UsersPage;
