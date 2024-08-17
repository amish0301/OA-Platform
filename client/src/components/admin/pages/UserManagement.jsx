import React, { useEffect, useState } from 'react';
import { Avatar } from '@mui/material';
import Table from '../../../shared/Table';
import axiosInstance from '../../../hooks/useAxios'
import Loader from '../../Loader';
import { GoCheckCircleFill as Check } from "react-icons/go";

const columns = [
    { field: 'id', headerName: 'ID', headerClassName: 'table-header', width: 200 },
    { field: 'avatar', headerName: 'Avatar', headerClassName: 'table-header', width: 100, renderCell: (params) => <Avatar src={params.row.profileImage} alt={params.row.avatar} /> },
    { field: 'name', headerName: 'Name', headerClassName: 'table-header', width: 200 },
    { field: 'email', headerName: 'Email', headerClassName: 'table-header', width: 220 },
    {
        field: 'admin', headerName: 'Admin', headerClassName: 'table-header', width: 100, renderCell: (params) => params.row.isAdmin ?
            <Check className='text-xl text-green-500' /> : '-'
    },
    { field: 'googleId', headerName: 'Google Id', headerClassName: 'table-header', width: 200 }
]

const UserManagement = () => {
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const res = await axiosInstance.get('/admin/users');

            if (res.data.success) {
                setRows(res.data.users.map((user) => ({ ...user, id: user?._id, name: user?.name, avatar: user?.profileImage, admin: user?.isAdmin, googleId: user?.googleId })));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, [])

    if (isLoading) return <Loader show={isLoading} size={70} color='#3a1c71' />

    return (
        <div>
            <Table rows={rows} cols={columns} heading={'All Users'} rowHeight={40} />
        </div>
    )
}

export default UserManagement