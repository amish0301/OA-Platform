import { Box, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../../hooks/useAxios';
import useFetchQuery from '../../../hooks/useFetchData';
import Loader from '../../Loader';
import TestCard from '../../TestCard';

const TestManagement = () => {

  const [tests, setTests] = useState([])
  const { response, _, isLoading, refetch: fetchTests } = useFetchQuery('/test');

  useEffect(() => {
    if (response) {
      setTests(response.tests);
    }
  }, [response])

  const handleDeleteTest = async (testId) => {
    try {
      const { data } = await axiosInstance.delete(`/test/${testId}`);
      if (data.success) {
        fetchTests();
        return toast.success(data.message)
      };
    } catch (error) {
      return toast.error(error.response.data.message);
    }
  }

  useEffect(() => {
    fetchTests()
  }, [])

  return (
    <Box sx={{ p: '1rem 2rem' }} spacing={3}>
      <Typography variant="h5" component={'h1'} sx={{ fontWeight: '600', color: 'GrayText', marginBottom: '.5rem' }}>
        Test Management
      </Typography>

      {isLoading && <Loader show={isLoading} />}

      <Stack direction={'row'} sx={{ width: '100%', display: 'flex', alignItems: 'center', margin: '1rem 0', gap: 3, flexWrap: 'wrap' }}>
        {tests?.map((test, index) => (
          <TestCard key={index} title={test.name} description={test.description} category={test.categories} duration={test.duration} totalQuestions={test.questions?.length} id={test._id} admin={true} onDeleteTest={handleDeleteTest} />
        ))}
        {!tests && <Typography variant='h6' sx={{ width: '100%', fontWeight: '600', color: 'GrayText' }}>No tests found</Typography>}
      </Stack>
    </Box>
  )
}

export default TestManagement