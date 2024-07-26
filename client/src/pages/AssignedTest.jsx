import React from 'react';
import TestCard from '../components/TestCard.jsx';
import { Container, Grid } from '@mui/material';

const AssignedTest = () => {
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

    return (
        <div>
            <Container maxWidth="md" className="p-4">
                <h1 className="text-2xl font-bold mb-4">Assigned Tests</h1>
                <Grid container spacing={3}>
                    {tests.length ? tests.map((test, index) => (
                        <Grid item xs={10} md={6} key={index}>
                            <TestCard
                                title={test.title}
                                description={test.description}
                                totalQuestions={test.totalQuestions}
                                time={test.time}
                                category={test.category}
                                subCategory={test.subCategory}
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