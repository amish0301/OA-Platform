import { Grid, Stack, Typography, styled } from '@mui/material';
import React from 'react';
import { FaTasks } from "react-icons/fa";
import { MdAssignment, MdSpaceDashboard } from "react-icons/md";
import { Link as LinkComponent, Outlet, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../hooks/useAxios.js';
import { RxExit as Exit } from "react-icons/rx";

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
    },
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

    const logoutHandler = async () => {
        try {
            const res = await axiosInstance.get('/auth/logout');
            if (res.data.success) {
                toast.success(res.data.message)
                dispatch(userNotExists())
                localStorage.removeItem("reduxState")
                localStorage.removeItem("accessToken")
            }
        } catch (error) {
            console.log('error whie logging out', error)
        }
    }

    return (
        <Stack
            width={{ xs: '100%', sm: '80%', md: '65%' }}
            sx={{
                padding: { xs: '1rem', sm: '2rem' },
                height: '100vh',
                bgcolor: '#286675',
                position: 'relative',
                flexDirection: 'column',
                justifyContent: 'space-between',
            }}
            spacing={{ xs: '1rem', sm: '2rem' }}
        >
            {/* Platform Title */}
            <Typography
                variant="h5"
                textTransform="capitalize"
                sx={{
                    fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.75rem' },
                    textAlign: { xs: 'center', sm: 'left' },
                    color: '#eefafc',
                    cursor: 'pointer',
                }}
                onClick={() => window.location.replace('/')}
            >
                OA-Platform
            </Typography>

            {/* Navigation Links */}
            <Stack
                spacing={{ xs: '1.5rem', sm: '2rem' }}
                sx={{ mt: { xs: '2rem', sm: '3rem' }, flexGrow: 1 }}
            >
                {navLinks.map((tab, i) => (
                    <Link
                        key={tab.path}
                        to={tab.path}
                        sx={{
                            textDecoration: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                            transition: 'background-color 0.3s ease',
                            ...(location.pathname === tab.path && {
                                bgcolor: '#030303',
                                color: '#cecfce',
                            }),
                            '&:hover': {
                                bgcolor: '#333333',
                                color: 'white',
                            },
                            color: '#cecfce',
                        }}
                    >
                        <TabItem Icon={tab.Icon} name={tab.name} />
                    </Link>
                ))}
            </Stack>

            <Link
                to="/"
                onClick={logoutHandler}
                sx={{
                    mt: 'auto',
                    textDecoration: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    transition: 'background-color 0.3s ease',
                    color: '#cecfce',
                    '&:hover': {
                        bgcolor: '#333333',
                        color: 'white',
                    },
                }}
            >
                <TabItem Icon={<Exit />} name="Logout" />
            </Link>
        </Stack>

    )
}



const TestDashboard = () => {
    return (
        <Grid container minHeight={'100vh'} sx={{ bgcolor: '#eff7f9' }} >
            <Grid item xs={12} sm={4} md={5} lg={4} sx={{
                height: '100vh',
            }}>
                <Navigation />
            </Grid>
            <Grid item xs={12} sm={8} md={9} lg={10} sx={{ overflowY: 'auto', p: { xs: 2, md: 1 }, height: '100%', bgcolor: '#eff7f9' }}>
                <Outlet />
            </Grid>
        </Grid>
    )
}

export default TestDashboard