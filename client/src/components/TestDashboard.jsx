import { Box, Container, Grid, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { SiGoogleanalytics as Analytics } from "react-icons/si"
import { useDispatch, useSelector } from 'react-redux'
import axioInstance from '../hooks/useAxios'
import { setIsLoading } from '../redux/slices/misc'
import TestWidget from '../shared/TestWidget'
import { DoughnutChart, LineChart } from './Charts'
import Loader from './Loader'
import TestDashboardTable from './TestDashboardTable'


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
      setStats({});
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

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '.5rem', margin: '3rem 0' }}>
        <Typography variant='h6' sx={{ fontWeight: '600' }}>Test Performance Analytics</Typography>
        <Analytics />
      </div>
      <Stack direction={'row'} spacing={2} sx={{ alignItems: 'center', gap: '6rem', margin: '1rem 0' }}>
        <Paper elevation={3} sx={{ padding: '1rem 1.2rem', borderRadius: '1rem', width: '100%', maxWidth: '35rem', bgcolor: 'rgba(0,0,0,0.02)' }}>
          <Typography textTransform={'capitalize'} variant='h6' sx={{ marginBottom: '1.5rem', fontWeight: '600', overflow: 'auto' }}>test performance</Typography>
          {<LineChart data={stats?.userPerformanceData} isTest={true} />}
        </Paper>
        <Paper elevation={3} sx={{ padding: '1rem 1.2rem', borderRadius: '1rem', width: '100%', maxWidth: '20rem', bgcolor: 'rgba(0,0,0,0.02)' }}>
          <Typography textTransform={'capitalize'} variant='h6' sx={{ marginBottom: '1.5rem', fontWeight: '600', overflow: 'auto' }}>Test Stats</Typography>
          {<DoughnutChart finish={(stats?.finishedTests * 100)} unfinished={(stats?.assignedTests - stats?.unfinishedTests) * 100} />}
        </Paper>
      </Stack>

      <Typography variant='h6' color={'text.primary'} sx={{ fontWeight: '600', margin: '2rem 0' }}>Recent Test Analytics</Typography>

      <TestDashboardTable />
    </Container>
  )
}

export default TestDashboard