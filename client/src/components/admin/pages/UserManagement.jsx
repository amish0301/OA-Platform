import { Avatar, Button, Checkbox } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { GoCheckCircleFill as Check } from "react-icons/go";
import useFetchQuery from '../../../hooks/useFetchData';
import Table from '../../../shared/Table';
import Loader from '../../Loader';

const UserManagement = () => {
    const [rows, setRows] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const { response, _, isLoading, refetch } = useFetchQuery('/admin/users');

    const columns = [
        ...(isEdit ? [{
            field: 'checkbox',
            width: 50,
            headerName: '',
            sortable: false,
            disableColumnMenu: true,
            renderCell: (params) => (
                <Checkbox
                    key={params.row.id}
                    disableRipple
                    checked={selectedUsers.indexOf(params.row.id) !== -1}
                    onClick={() => handleToggle(params.row.id)}
                />
            ),
        }] : []),
        { field: 'id', headerName: 'ID', headerClassName: 'table-header', width: 200 },
        { field: 'avatar', headerName: 'Avatar', headerClassName: 'table-header', width: 100, renderCell: (params) => <Avatar src={params.row.profileImage} alt={params.row.avatar} /> },
        { field: 'name', headerName: 'Name', headerClassName: 'table-header', width: 200 },
        { field: 'email', headerName: 'Email', headerClassName: 'table-header', width: 220 },
        {
            field: 'admin', headerName: 'Admin', headerClassName: 'table-header', width: 100, renderCell: (params) => params.row.isAdmin ?
                <Check className='text-xl text-green-500' /> : '-'
        },
        { field: 'googleId', headerName: 'Google Id', headerClassName: 'table-header', width: 200 }
    ];

    const handleToggle = (userId) => {
        const currentIndex = selectedUsers.indexOf(userId);
        const newSelected = [...selectedUsers];

        if (currentIndex === -1) {
            newSelected.push(userId);
        } else {
            newSelected.splice(currentIndex, 1);
        }

        setSelectedUsers(newSelected);
    };

    useEffect(() => {
        if (response) {
            setRows(response.users.map((user) => ({ ...user, id: user?._id, name: user?.name, avatar: user?.profileImage, admin: user?.isAdmin, googleId: user?.googleId })));
        }
    }, [response])

    useEffect(() => {
        refetch();
    }, [])

    if (isLoading) return <Loader show={isLoading} />
    return (
        <div className='relative'>
            <Table rows={rows} cols={columns} heading={'All Users'} rowHeight={40} isEditUsers={isEdit} />
            <Button variant='contained' onClick={() => setIsEdit(prev => !prev)} sx={{ position: 'absolute', top: '5%', right: '10%', bgcolor: 'green' }}>{isEdit ? 'Save' : 'Edit'}</Button>
        </div>
    )
}

export default UserManagement