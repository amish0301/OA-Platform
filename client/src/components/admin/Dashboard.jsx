import { Container, Paper, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { GrDocumentTest as TestIcon } from "react-icons/gr";
import { IoMdPerson as PersonIcon } from "react-icons/io";
import axiosInstance from '../../hooks/useAxios';
import { Widget } from '../../shared/Widget';
import { DoughnutChart, LineChart, PieChart } from '../Charts';
import Loader from '../Loader';


const Dashboard = () => {

  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const testData = [
    { category: 'Math', average: 78 },
    { category: 'Science', average: 85 },
    { category: 'English', average: 67 },
    { category: 'History', average: 73 },
    { category: 'Geography', average: 80 },
  ];

  const getData = async () => {
    setIsLoading(true)
    try {
      const { data } = await axiosInstance.get('/admin/dashboard/stats');
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, [])

  if (isLoading) return <Loader show={isLoading} />

  const Widgets = <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: '1rem', sm: '4rem' }} alignItems={'center'} gap={{ xs: '1rem', sm: '2rem' }} margin={'2rem 0'}>
    <Widget title={"Users"} value={stats?.usersCount} Icon={<PersonIcon />} />
    <Widget title={"Tests"} value={stats?.testsCount} Icon={<TestIcon />} />
    <Widget title={"Tests"} value={stats?.testsCount} Icon={<TestIcon />} />
  </Stack>;

  return (
    <Container component={'main'}>
      <Stack direction={{ xs: 'column', lg: 'row' }} sx={{ gap: '1rem', width: '100%' }} justifyContent={'space-between'} alignItems={{ xs: 'center', lg: 'stretch' }} flexWrap={'wrap'} >
        <Paper elevation={3} sx={{ padding: '1rem 2rem', borderRadius: '1rem', width: '100%', maxWidth: '30rem', bgcolor: 'rgba(0,0,0,0.03)' }}>
          <Typography textTransform={'capitalize'} variant='h6' sx={{ marginBottom: '1.5rem', fontWeight: '600', overflow: 'auto' }}>Weekly new users</Typography>
          {<LineChart label={'Count of New Users'} data={stats?.userChartData} />}
        </Paper>

        <Paper elevation={3} sx={{ padding: '1rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: '20rem', bgcolor: 'rgba(0,0,0,0.03)' }}>
          <Typography variant='h6' textTransform={'capitalize'} sx={{ fontWeight: '600', overflow: 'auto', marginBottom: '1rem' }}>Test Completion Overview</Typography>
          <DoughnutChart finish={stats?.testChartData?.finishedTests || 20} unfinish={stats?.testChartData?.unfinishedTests || 80} />
        </Paper>

        <Paper elevation={3} sx={{ padding: '1rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: '20rem', bgcolor: 'rgba(0,0,0,0.03)' }}>
          <Typography variant='h6' textTransform={'capitalize'} sx={{ fontWeight: '600', overflow: 'auto', marginBottom: '1rem' }}>Test Category</Typography>
          <PieChart pieData={stats?.categoryChartData || testData} />
        </Paper>
      </Stack>
      {Widgets}
    </Container>
  )
}

export default Dashboard