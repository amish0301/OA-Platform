import { Box, Container, Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import axiosInstance from '../hooks/useAxios'
import Loader from './Loader'
import TestCard from './TestCard'

const TestCompleted = () => {

  // fetch completed tests
  const [completedTests, setCompletedTests] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchCompletedTests = async () => {
    setLoading(true);

    try {
      const { data } = await axiosInstance.get('/user/completed');
      setCompletedTests(data.testData); 
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCompletedTests()
  }, [])

  if (loading) return <Loader show={loading} size={70} color='#3a1c71' />
  return (
    <Container sx={{ minWidth: '100%', height: '100vh', overflowY: 'auto' }} className="p-4 relative" >
      <h1 className="text-2xl font-bold mb-4">Completed Tests</h1>

      <Box sx={{ width: '100%', overflowY: 'auto', p: '1rem' }}>
        {
          completedTests?.length
            ? <Grid container spacing={2} >
              {
                completedTests.map((test, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <TestCard title={test.name} description={test.description} duration={test.duration} score={test.score}  />
                  </Grid>
                ))
              }
            </Grid>
            : <p className="text-center ">No tests completed yet</p>
        }
      </Box>

    </Container>
  )
}

export default TestCompleted