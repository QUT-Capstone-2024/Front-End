import React, { useEffect, useState } from 'react';
import { getAllUsers, deleteUser, updateUser, archiveUser } from '../Services';
import { UserWithId } from '../types';
import { RootState } from '../Redux/store';
import { useSelector } from 'react-redux';
import { UserCard, SearchBar, Spacer, CategorySelector, CustomButton } from '../Components';
import { 
    Search as SearchIcon, 
    Refresh as RefreshIcon, 
    Add as PlusIcon,
    Remove as MinusIcon
} from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import { useCheckAuth } from '../Hooks/useCheckAuth';



const UsersPage: React.FC = () => {
    const token = useSelector((state: RootState) => state.user.token);
    const [users, setUsers] = useState<UserWithId[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UserWithId[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedUserType, setSelectedUserType] = useState<string>('All');
    const [selectedUserStatus, setSelectedUserStatus] = useState<string>('All');
    const [showSearch, setShowSearch] = useState<boolean>(false);
    const { userType } = useCheckAuth();
    const isGod = userType === 'HARBINGER';

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await getAllUsers(token!);
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

    // Combined filter based on search term, user type, and user status
    useEffect(() => {
        let filtered = users;
        if (searchTerm !== '') {
            filtered = filtered.filter((user) => {
                const nameMatch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
                const emailMatch = user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
                return nameMatch || emailMatch;
            });
        }
        if (selectedUserType !== 'All') {
            filtered = filtered.filter(user => user.userType === selectedUserType);
        }
        if (selectedUserStatus !== 'All') {
            filtered = filtered.filter(user => user.status === selectedUserStatus);
        }
        setFilteredUsers(filtered);
    }, [searchTerm, selectedUserType, selectedUserStatus, users]);

    const handleDelete = async (id: number) => {
        if (!token) {
            console.error('No token found, please log in.');
            return;
        }

        try {
            if (isGod) {
                await deleteUser(id, token);
            } else {
                await archiveUser(id, token);
            }
            await fetchUsers();
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
            await fetchUsers();
        } catch (error) {
            console.error(error);
        }
    };

    const handleSearch = (term: string) => {
        setSearchTerm(term);
    };

    const userTypeOptions = [
        { value: 'All', label: 'All' },
        { value: 'CL_ADMIN', label: 'Administrator' },
        { value: 'CL_USER', label: 'Employee' },
        { value: 'PROPERTY_OWNER', label: 'Property Owner' },
        { value: 'PROPERTY_VALUER', label: 'Industry User' },
    ];

    const userStatusOptions = [
        { value: 'All', label: 'All' },
        { value: 'ACTIVE', label: 'Active' },
        { value: 'ARCHIVED', label: 'Archived' },
    ];
      

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className='user-page-container'>

            {/* Mobile / Tablet Search */}
            <div style={{ display: 'flex', gap: '40px'}}>
                <CustomButton
                    buttonType='successButton'
                    className='mobile-tablet-only'
                    label='Find a user'
                    withIcon='right'
                    icon={!showSearch ?
                        <PlusIcon sx={{ marginLeft: '10px' }}/>
                            :
                        <MinusIcon sx={{ marginLeft: '10px' }}/>
                    }
                    onClick={() => setShowSearch(!showSearch)}
                />
                <IconButton className='mobile-tablet-only' style={{ justifySelf: 'end'}} onClick={fetchUsers}>
                    <RefreshIcon className='refresh-icon'/>
                </IconButton>
            </div>

            <div 
                className='user-search-container mobile-tablet-only'
                style={{ display: showSearch ? 'block' : 'none' }}
            >
                <Spacer height={0.5} />
                <h4 style={{marginBottom: '10px'}}>Search by email or name</h4>
                <div style={{display: 'flex', gap: '1rem'}}>
                    <SearchBar onSearch={handleSearch} placeholder='Start typing ...'/>
                </div>
                <h4 style={{marginBottom: '10px'}}>Search by user type</h4>
                <CategorySelector 
                    label=""
                    value={selectedUserType}
                    onChange={(event) => setSelectedUserType(event.target.value)}
                    options={userTypeOptions}
                />
                <h4 style={{marginBottom: '10px'}}>Search by user status</h4>
                <CategorySelector 
                    label=""
                    value={selectedUserStatus}
                    onChange={(event) => setSelectedUserStatus(event.target.value)}
                    options={userStatusOptions}
                />
            </div>

            {/* Desktop Search */}
            <div className='user-search-container desktop-only'>
                <h4>Search by email or name</h4>
                <div style={{display: 'flex', gap: '1rem'}}>
                    <SearchBar onSearch={handleSearch} placeholder='Start typing ...'/>
                    <IconButton onClick={fetchUsers}>
                        <RefreshIcon className='refresh-icon'/>
                    </IconButton>
                </div>
                <h4>Search by user type</h4>
                <CategorySelector 
                    label=""
                    value={selectedUserType}
                    onChange={(event) => setSelectedUserType(event.target.value)}
                    options={userTypeOptions}
                />
                <h4>Search by user status</h4>
                <CategorySelector 
                    label=""
                    value={selectedUserStatus}
                    onChange={(event) => setSelectedUserStatus(event.target.value)}
                    options={userStatusOptions}
                />
            </div>

            <Spacer height={0.5} className='mobile-tablet-only'/>

            <div>
                <h2 className='mobile-tablet-only'>Users</h2>
                <Spacer height={1} className='mobile-tablet-only'/>
                <div className='scrollable-list-container users'>
                    {filteredUsers.map(user => (
                        <div key={user.id}>
                            <Spacer height={0.5} />
                            <UserCard user={user} onDelete={handleDelete} onUpdate={handleUpdate}/>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UsersPage;
