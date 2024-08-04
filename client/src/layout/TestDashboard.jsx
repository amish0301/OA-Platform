import React from 'react'
import { Link as LinkComponent, useLocation, Outlet } from 'react-router-dom'
import { Grid, Typography, styled, Stack } from '@mui/material'
import { MdSpaceDashboard, MdAssignment } from "react-icons/md";
import { FaTasks } from "react-icons/fa";
import { GoSignOut } from 'react-icons/go';

const navLinks = [
    {
        name: "Dashboard",
        Icon: <MdSpaceDashboard />,
        path: '/test/dashboard'
    },
    {
        name: "Completed Tests",
        Icon: <FaTasks />,
        path: '/test/dashboard/completed'
    },
    {
        name: "Assigned Tests",
        Icon: <MdAssignment />,
        path: '/test/dashboard/assigned'
    }
];

const Link = styled(LinkComponent)(
    `text-decoration: none;
    border-radius: 2rem;
    padding: 1rem 2rem;
    color: black;
    :hover {
        background-color: #A9A9A9;
    }`
)

const TabItem = ({ Icon, name }) => {
    return (
        <Stack direction={'row'} spacing={'1rem'} alignItems={'center'}>
            <div className='text-lg'>
                {Icon}
            </div>
            <Typography variant='body1' sx={{ fontWeight: '600' }}>{name}</Typography>
        </Stack>
    );
}

const Navigation = () => {

    const location = useLocation();

    const logoutHandler = () => {
        console.log('logout');
    }

    return (
        <Stack p={'2rem'} spacing={'4rem'} height={'100%'} sx={{ position: 'relative' }}>
            <Typography variant='h5' textTransform={'capitalize'} textAlign={'left'} sx={{ fontWeight: '600', color: '#3a1c71' }}>test dashboard</Typography>

            <Stack spacing={'2rem'} width={'100%'}>
                {
                    navLinks.map((tab, index) => (
                        <Link key={index} to={tab.path} sx={location.pathname === tab.path ? { backgroundColor: '#A9A9A9' } : { backgroundColor: 'transparent' }}>
                            <TabItem Icon={tab.Icon} name={tab.name} />
                        </Link>
                    ))
                }
            </Stack>
            <Stack sx={{ position: 'absolute', bottom: '2rem', width: '100%', right: '0' }}>
                <Link onClick={logoutHandler} >
                    <TabItem Icon={<GoSignOut />} name={'Logout'} />
                </Link>
            </Stack>
        </Stack>
    )
}



const TestDashboard = () => {
    return (
        <Grid container minHeight={'100vh'} minWidth={'100%'}>
            <Grid item lg={3} xs={3} sx={{ display: { xs: 'none', sm: 'block' }, bgcolor: '#f4f4f4', height: '100vh' }}>
                <Navigation />
            </Grid>
            <Grid item xs={9}>
                <Outlet />
            </Grid>
        </Grid>
    )
}

export default TestDashboard