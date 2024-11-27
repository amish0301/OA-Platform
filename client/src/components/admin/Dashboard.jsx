import { Container, Paper, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { AiFillLike as LikeIcon } from "react-icons/ai";
import { GrDocumentTest as TestIcon } from "react-icons/gr";
import { IoMdPerson as PersonIcon } from "react-icons/io";
import { toast } from 'react-toastify';
import useFetchQuery from '../../hooks/useFetchData';
import { Widget } from '../../shared/Widget';
import { DoughnutChart, LineChart, PieChart } from '../Charts';
import Loader from '../Loader';


const Dashboard = () => {
  const [stats, setStats] = useState({});
  const { response, error, isLoading, refetch } = useFetchQuery('/admin/dashboard/stats');
  
  useEffect(() => {
    if (response) setStats(response.stats)
  }, [response])

  useEffect(() => {
    document.title = 'Admin Dashboard'
    refetch()
  }, [])

  if (error) return toast.error(error)
  if (isLoading) return <Loader show={isLoading} />

  const Widgets = <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: '1rem', sm: '4rem' }} justifyContent={'space-between'} alignItems={'center'} gap={{ xs: '1rem', sm: '2rem' }} margin={'2rem 0'}>
    <Widget title={"Total Users"} value={stats?.usersCount} Icon={<PersonIcon />} />
    <Widget title={"Total Tests"} value={stats?.testsCount} Icon={<TestIcon />} />
    <Widget title={"Most Popular Test Category"} value={stats?.mostPopularTestCategoryName} Icon={<LikeIcon />} />
  </Stack>;

  return (
    <Container component={'main'}>
      <Typography variant='h5' component={'h1'} sx={{ fontWeight: '600', color: 'GrayText', margin: '2rem 0' }}>User and Test Analytics</Typography>
      <Stack direction={{ xs: 'column', lg: 'row' }} sx={{ gap: '1rem', width: '100%' }} justifyContent={'space-between'} alignItems={{ xs: 'center', lg: 'stretch' }} flexWrap={'wrap'} >
        <Paper elevation={3} sx={{ padding: '1rem 2rem', borderRadius: '1rem', width: '100%', maxWidth: '30rem', bgcolor: 'rgba(0,0,0,0.03)' }}>
          <Typography textTransform={'capitalize'} variant='h6' sx={{ marginBottom: '1.5rem', fontWeight: '600', overflow: 'auto' }}>Weekly new users</Typography>
          {<LineChart label={'Count of New Users'} data={stats?.userChartData} />}
        </Paper>

        <Paper elevation={3} sx={{ padding: '1rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: '20rem', bgcolor: 'rgba(0,0,0,0.03)' }}>
          <Typography variant='h6' textTransform={'capitalize'} sx={{ fontWeight: '600', overflow: 'auto', marginBottom: '1rem' }}>Test Completion Rate</Typography>
          <DoughnutChart finish={stats?.testChartData?.finishedTests || 50} unfinish={stats?.testChartData?.unfinishedTests || 50} />
        </Paper>

        <Paper elevation={3} sx={{ padding: '1rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: '20rem', bgcolor: 'rgba(0,0,0,0.03)' }}>
          <Typography variant='h6' textTransform={'capitalize'} sx={{ fontWeight: '600', overflow: 'auto', marginBottom: '1rem' }}>Test Category</Typography>
          <PieChart pieData={stats?.categoryChartData} />
        </Paper>
      </Stack>
      {Widgets}
    </Container>
  )
}

export default Dashboard