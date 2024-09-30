import { Avatar } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { GoCheckCircleFill as Check } from "react-icons/go";
import useFetchQuery from '../../../hooks/useFetchData';
import Table from '../../../shared/Table';
import Loader from '../../Loader';
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
    const { response, _, isLoading, refetch } = useFetchQuery('/admin/users');

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
        <div>
            <Table rows={rows} cols={columns} heading={'All Users'} rowHeight={40} />
        </div>
    )
}

export default UserManagement