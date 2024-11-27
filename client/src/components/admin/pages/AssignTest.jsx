import { Button, Checkbox, List, ListItem, ListItemText } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useFetchQuery from '../../../hooks/useFetchData';
import Loader from '../../Loader';

const AssignTest = () => {
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [search, setSearch] = useState('');
    const [testId, setTestId] = useState('');
    const [users, setUsers] = useState([]);

    const { response: fetchUserResponse, error: fetchUserError, isLoading: isLoadingFetchUsers, refetch: fetchUsers } = useFetchQuery(`/admin/users?search=${search}`);
    const { response: assignResponse, error: assignError, isLoading: isAssignLoading, refetch: assignTest } = useFetchQuery('/test/assign', 'POST', {
        headers: {
            'Content-Type': 'application/json',
        }
    });

    const handleToggle = (userId) => {
        const currentIndex = selectedUserIds.indexOf(userId);
        const newSelected = [...selectedUserIds];

        if (currentIndex === -1) {
            newSelected.push(userId);
        } else {
            newSelected.splice(currentIndex, 1);
        }

        setSelectedUserIds(newSelected);
    };
    const resetState = () => {
        setSelectedUserIds([]);
        setTestId('');
    }

    useEffect(() => {
        if (assignResponse) {
            toast.success(assignResponse.message)
        } else if (assignError) toast.error(assignError)

        return () => {
            resetState()
        }
    }, [assignResponse, assignError])

    useEffect(() => {
        if (fetchUserResponse) {
            setUsers(fetchUserResponse.users);
        }
        if (fetchUserError) throw fetchUserError;
    }, [fetchUserResponse, fetchUserError])

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers();
        }, 500);
        return () => clearTimeout(timer);
    }, [search])


    return (
        <div className='w-full max-w-screen-lg px-6 lg:px-10 py-8 box-border'>
            <h1 className='text-3xl font-bold mb-6 lg:mb-10 text-gray-800'>Assign Test</h1>

            <div className='flex flex-col lg:flex-row items-center justify-between gap-4'>
                {/* Search user input */}
                <input
                    type="text"
                    placeholder="Search user by name..."
                    className="border border-gray-300 rounded-md px-4 py-2 w-full lg:w-1/3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {/* Test ID input */}
                <input
                    type="text"
                    placeholder="Paste Test Id here"
                    value={testId}
                    onChange={(e) => setTestId(e.target.value)}
                    className="border border-gray-300 rounded-md px-4 py-2 w-full lg:w-1/4 shadow-sm text-ellipsis focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* De-select button */}
                <Button
                    variant='outlined'
                    color='error'
                    disabled={!selectedUserIds.length}
                    onClick={() => setSelectedUserIds([])}
                    sx={{ minWidth: '120px' }}
                >
                    De-Select All
                </Button>

                {/* Assign test button */}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => assignTest({ testId, userIds: selectedUserIds })}
                    disabled={selectedUserIds.length === 0 || isAssignLoading || !testId}
                    sx={{ minWidth: '120px' }}
                >
                    Assign Test
                </Button>
            </div>

            {/* User list */}
            {users?.length > 0 ? (
                <div className='w-full mt-6 bg-white rounded-md border border-gray-300 shadow-sm'>
                    <List>
                        {isLoadingFetchUsers ? <Loader show={isLoadingFetchUsers} /> : users.map((user) => (
                            <ListItem
                                key={user._id}
                                sx={{
                                    cursor: 'pointer',
                                    width: '100%',
                                    userSelect: 'none',
                                    '&:hover': { backgroundColor: '#f0f0f0' }
                                }}
                                onClick={() => handleToggle(user._id)}
                            >
                                <Checkbox
                                    edge="start"
                                    checked={selectedUserIds.indexOf(user._id) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                />
                                <ListItemText
                                    primary={user.name}
                                    primaryTypographyProps={{
                                        fontSize: '1rem',
                                        fontWeight: '500',
                                        color: '#333'
                                    }}
                                />
                            </ListItem>
                        ))
                        }
                    </List>
                </div>
            ) : (
                <p className='text-gray-500 mt-6 text-center'>No users found</p>
            )}
        </div>

    );
};

export default AssignTest;
