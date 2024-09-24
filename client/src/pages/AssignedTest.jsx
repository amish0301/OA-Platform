import { Container, Grid } from '@mui/material';
import React, { lazy, useEffect, useState } from 'react';
import Loader from '../components/Loader.jsx';
import axiosInstance from '../hooks/useAxios.js';
const TestCard = lazy(() => import('../components/TestCard.jsx'));

const AssignedTest = () => {

    const [loading, setLoading] = useState(false);
    const [tests, setTests] = useState([]);

    const fetchTests = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get('/test/assigned');
            setTests(res.data.tests)
        } catch (error) {
            throw error
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchTests();
        return () => {
            setTests([])
            setLoading(false)
        }
    }, [])

    if (loading) return <Loader show={loading} />

    return (
        <Container sx={{ minWidth: '100%', height: '100vh', overflowY: 'auto', p: 3 }}>
            <div className='flex justify-between items-center my-5'>
                <h1 className="text-2xl font-bold mb-4">Assigned Tests</h1>
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