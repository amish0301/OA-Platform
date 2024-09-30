import { Container, Grid } from '@mui/material';
import React, { lazy, useEffect, useState } from 'react';
import Loader from '../components/Loader.jsx';
import useFetchQuery from '../hooks/useFetchData.js';
const TestCard = lazy(() => import('../components/TestCard.jsx'));

const AssignedTest = () => {
    const [tests, setTests] = useState([]);
    const { response, error, isLoading, refetch: fetchTests } = useFetchQuery('/test/assigned');

    useEffect(() => {
        if (response) {
            setTests(response.tests);
        } else if (error) throw error;
    }, [response, error])

    useEffect(() => {
        fetchTests();
    }, [])

    return (
        <Container sx={{ minWidth: '100%', height: '100vh', overflowY: 'auto', p: 3 }}>
            <div className='flex justify-between items-center my-5'>
                <h1 className="text-2xl font-bold mb-4">Assigned Tests</h1>
            </div>
            <Grid container spacing={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {isLoading ? <Loader show={isLoading} /> : tests?.map((test, index) => (
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
                }
                {!tests && <p className='absolute top-1/2 text-xl opacity-50'>" No tests found. "</p>}
            </Grid>
        </Container>
    );
};

export default AssignedTest;