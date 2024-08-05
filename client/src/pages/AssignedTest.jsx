import React, { useEffect, useState } from 'react';
import TestCard from '../components/TestCard.jsx';
import { Container, Grid } from '@mui/material';
import axiosInstance from '../hooks/useAxios.js';
import Loader from '../components/Loader.jsx';

const AssignedTest = () => {

    // one fetch call will be made to get all the assigned tests
    const [loading, setLoading] = useState(false);

    const tests = [
        {
            title: 'Mathematics Test',
            description: 'A comprehensive test covering algebra, geometry, and calculus.',
            time: '30 min',
            totalQuestions: 10,
            category: 'Web Development',
            subCategory: 'Frontend',
        },
        {
            title: 'Science Test',
            description: 'A test on physics, chemistry, and biology.',
            time: '30 min',
            totalQuestions: 20,
            category: 'Web Development',
            subCategory: 'Backend',
        },
    ];

    const fetchTests = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get('/test/assigned');
            console.log(res.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    if(loading) return <Loader show={loading}/>

    return (
        <div>
            <Container sx={{ minWidth: '100%' }} className="p-4 min-h-screen" >
                <div className='flex justify-between items-center my-5'>
                    <h1 className="text-2xl font-bold mb-4">Assigned Tests</h1>
                    <button type="button" className='py-3 text-sm px-4 bg-blue-800 text-white font-semibold rounded-lg shadow-md shadow-black/50 hover:bg-blue-600 hover:transition-colors duration-300' onClick={fetchTests}>Check if Any test is assigned</button>
                </div>
                <Grid container spacing={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {tests.length ? tests.map((test, index) => (
                        <Grid item xs={10} md={6} key={index}>
                            <TestCard
                                title={test.title}
                                description={test.description}
                                totalQuestions={test.totalQuestions}
                                time={test.time}
                                category={test.category}
                                subCategory={test.subCategory}
                                id={test._id}
                            />
                        </Grid>
                    ))
                        : (
                            <p className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl opacity-50'>" No tests found. "</p>
                        )
                    }
                </Grid>
            </Container>
        </div>
    );
};

export default AssignedTest;