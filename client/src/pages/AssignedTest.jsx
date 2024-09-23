import React, { useEffect, useState } from 'react';
import TestCard from '../components/TestCard.jsx';
import { Container, Grid } from '@mui/material';
import axiosInstance from '../hooks/useAxios.js';
import Loader from '../components/Loader.jsx';
import { toast } from 'react-toastify';

const AssignedTest = () => {

    const [loading, setLoading] = useState(false);
    const [tests, setTests] = useState([]);

    const fetchTests = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get('/test/assigned');
            if (res.data.success) {
                setTests(res.data.tests)
                toast.success(res.data.message)
            }
        } catch (error) {
            // throw error;
            toast.error(error.response.data.message)
        } finally {
            setLoading(false);
        }
    }

    // MIGHT revoked below
    // useEffect(() => {
    //     fetchTests();
    //     return () => {
    //         setTests([])
    //         toast.dismiss();
    //     }
    // }, [])

    if (loading) return <Loader show={loading} />

    return (
        <Container sx={{ minWidth: '100%', height: '100vh', overflowY: 'auto', p: 3}}>
            <div className='flex justify-between items-center my-5'>
                <h1 className="text-2xl font-bold mb-4">Assigned Tests</h1>
                <button type="button" className='py-3 text-sm px-4 bg-blue-800 text-white font-semibold rounded-lg shadow-md shadow-black/50 hover:bg-blue-600 hover:transition-colors duration-300' onClick={fetchTests}>Check if Any test is assigned</button>
            </div>
            <Grid container spacing={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {tests?.length ? tests.map((test, index) => (
                    <Grid item xs={10} md={6} key={index}>
                        <TestCard
                            title={test?.name || 'No title'}
                            description={test?.description || 'No description'}
                            totalQuestions={test?.questions.length}
                            duration={test?.duration || 'No duration'}
                            category={test?.categories || 'Category not Mentioned'}
                            subCategory={test?.subCategory || 'No subCategory'}
                            id={test._id}
                        />
                    </Grid>
                ))
                    : (
                        <p className='absolute top-1/2 text-xl opacity-50'>" No tests found. "</p>
                    )
                }
            </Grid>
        </Container>
    );
};

export default AssignedTest;