import { Chip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { RxCheckCircled as CheckIcon, RxCrossCircled as CrossIcon } from "react-icons/rx";
import axiosInstance from '../hooks/useAxios';
import Table from '../shared/Table';
import Loader from './Loader';


const columns = [
    { field: 'name', headerName: 'Test Name', headerClassName: 'table-header', width: 200 },
    { field: 'score', headerName: 'Score', headerClassName: 'table-header', width: 200 },
    { field: 'completedAt', headerName: 'Finished At', headerClassName: 'table-header', width: 200 },
    {
        field: 'categories', headerName: 'Category', headerClassName: 'table-header', width: 200, renderCell: (params) => params.row.categories?.map((category, index) => <Chip
            key={index}
            label={category}
            sx={{ bgcolor: '#286675', color: 'white' }}
        />)
    },
    {
        field: 'isPassed', headerName: 'Qualified', headerClassName: 'table-header', width: 150, renderCell: (params) => params.row.isPassed ? <CheckIcon style={{ color: 'green', fontSize: '1.5rem' }} /> : <CrossIcon style={{ color: 'red', fontSize: '1.5rem' }} />
    },
]

const TestDashboardTable = () => {
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const getData = async () => {
        setIsLoading(true);
        try {
            const { data } = await axiosInstance.get('/user/dashboard/table');

            if (data.success) {
                const uniqueRows = data.tableData.map(row => ({
                    id: row._id,
                    isPassed: row.isPassed,
                    name: row.name,
                    score: row.score,
                    completedAt: row.completedAt,
                    categories: row.categories
                }));

                setRows(uniqueRows);
            }
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    }


    useEffect(() => {
        getData();
        return () => {
            setRows([]);
        }
    }, []);

    if (isLoading) return <Loader show={isLoading} />
    return (
        <div>
            <Table rows={rows} cols={columns} heading={'Test History'} rowHeight={40} />
        </div>
    )
}

export default TestDashboardTable