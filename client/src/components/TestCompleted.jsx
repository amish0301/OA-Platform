import { Box, Button, Card, CardActions, CardContent, Container, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { FaRegCalendarAlt as Calendar } from "react-icons/fa";
import { RiAwardFill as Award } from "react-icons/ri";
import { toast } from 'react-toastify';
import useFetchQuery from '../hooks/useFetchData';
import Loader from './Loader';

const TestCompleted = () => {

  // fetch completed tests
  const [completedTests, setCompletedTests] = useState([])
  const { response, error, isLoading: loading, refetch: fetchCompletedTests } = useFetchQuery('/user/completed');

  useEffect(() => {
    if (response) setCompletedTests(response.testData);
    else if (error) toast.error(error);
  }, [response, error])

  useEffect(() => {
    fetchCompletedTests()
  }, [])

  if (loading) return <Loader show={loading} />
  return (
    <Container
      sx={{
        minWidth: '100%', height: '100vh', overflowY: 'auto',
        p: { xs: '1rem', md: '2rem' }, boxSizing: 'border-box'
      }}
    >
      <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', mb: 4 }}>
        Completed Tests
      </Typography>

      <Box sx={{ width: '100%', overflowY: 'auto', p: '1rem' }}>
        {completedTests?.length ? (
          <Grid container spacing={2} direction={'row'} justifyContent={'flex-start'} flexWrap={'wrap'} alignItems={'center'}>
            {completedTests.map((test, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card
                  sx={{
                    height: '100%', display: 'flex', flexDirection: 'column',
                    justifyContent: 'space-between', maxWidth: '350px', mx: 'auto',
                    boxShadow: 3,
                    transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.03)' }
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" component="div" gutterBottom>
                      {test?.test?.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Calendar style={{ marginRight: '0.5rem' }} />
                      <Typography variant="body2" color="text.secondary">
                        Submitted: {new Date(test?.time).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Award style={{ color: 'purple', marginRight: '0.5rem' }} />
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }} color="purple">
                        Score: {test?.score} / {test?.test?.questions?.length}
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button size="small" variant="contained" color="primary">
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1" align="center">
            No tests completed yet
          </Typography>
        )}
      </Box>
    </Container>
  )
}

export default TestCompleted