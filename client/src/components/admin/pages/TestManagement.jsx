import { Box, Button, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../hooks/useAxios';
import Loader from '../../Loader';
import TestCard from '../../TestCard';

const TestManagement = () => {

  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchTests = async () => {
    setLoading(true);

    try {
      const { data } = await axiosInstance.get('/test');
      if (data.success) {
        setTests(data.tests);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTests();
  }, [])

  if (loading) return <Loader show={loading} size={70} color='#3a1c71' />

  return (
    <Box sx={{ p: '1rem 2rem' }} spacing={3}>
      <Typography variant="h5" component={'h1'} sx={{ fontWeight: '600', color: 'GrayText', marginBottom: '.5rem' }}>
        Test Management
      </Typography>

      <Stack direction={'row'} sx={{ width: '100%', display: 'flex', alignItems: 'center', margin: '1rem 0', gap: 3, flexWrap: 'wrap' }}>
        {tests?.map((test, index) => (
          <TestCard key={index} title={test.name} description={test.description} category={test.categories} duration={test.duration} totalQuestions={test.questions?.length} id={test._id} admin={true} />
        ))}
        {!tests && <Typography variant='h6' sx={{ width: '100%', fontWeight: '600', color: 'GrayText' }}>No tests found</Typography>}
      </Stack>
    </Box>
  )
}

export default TestManagement