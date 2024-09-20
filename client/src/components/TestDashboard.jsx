import { Box, Container, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import TestWidget from '../shared/TestWidget'
import { useDispatch, useSelector } from 'react-redux'
import { setIsLoading } from '../redux/slices/misc'
import axioInstance from '../hooks/useAxios'
import Loader from './Loader'


const TestDashboard = () => {

  const { isLoading } = useSelector((state) => state.misc)
  const [stats, setStats] = useState({});

  const dispatch = useDispatch();

  const getData = async () => {
    dispatch(setIsLoading(true))
    try {
      const { data } = await axioInstance.get('/user/dashboard/stats')
      if (data.success) setStats(data.stats)
    } catch (error) {
      throw error
    } finally {
      dispatch(setIsLoading(false))
    }
  }

  useEffect(() => {
    document.title = 'Test Dashboard'

    getData()
    return () => {
      document.title = '';
      setStats({})
    }
  }, [])

  if (isLoading) return <Loader show={isLoading} />

  return (
    <Container component={'main'} maxWidth={'lg'}>
      <Box elevation={3} sx={{ p: '1rem 0', width: '100%', bgcolor: 'smokeywhite', borderBottom: '1px solid grey' }}>
        <Typography variant={'h5'} component={'h1'} sx={{ fontWeight: '600', alignItems: 'center', justifyContent: 'flex-start' }}>Dashboard</Typography>
      </Box>

      <Stack direction={'row'} spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between', margin: '1rem 0' }}>
        <TestWidget title={'Assigned Tests'} value={stats?.assignedTests} info={'Total tests assigned'} />
        <TestWidget title={'Accuracy'} value={stats?.accuracy + ' %'} info={'Accuracy of finished tests'} />
        <TestWidget title={'Finished Tests'} value={stats?.finishedTests} info={'Count of total finished tests'} />
      </Stack>
    </Container>
  )
}

export default TestDashboard