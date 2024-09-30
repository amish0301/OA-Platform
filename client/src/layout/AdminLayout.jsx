import { Box, Drawer, Grid, IconButton, Stack, Typography, styled } from '@mui/material';
import React, { Suspense } from 'react';
import { GrDocumentTest as TestIcon } from "react-icons/gr";
import { IoCreateOutline as Create } from "react-icons/io5";
import { MdAssignmentTurnedIn as Assign, MdOutlineClose as CloseIcon, MdDashboard as DashboardIcon, MdManageAccounts as ManageAccountsIcon, MdMenu as MenuIcon } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

import { Link as LinkComponent, Outlet, useLocation } from 'react-router-dom';
import AppBar from '../components/admin/AppBar';
import { setIsMobile } from '../redux/slices/misc';
import { AdminLayoutLoader } from '../layout/LayoutLoaders'

const Link = styled(LinkComponent)(
    `text-decoration: none;
    border-radius: 2rem;
    padding: 1rem 2rem;
    color: black;
    :hover {
        background-color: #A9A9A9;
    }`
)

// Routes
const adminTabs = [
    {
        name: "Dashboard",
        icon: <DashboardIcon />,
        path: "/admin/dashboard",
    },
    {
        name: "Users",
        icon: <ManageAccountsIcon />,
        path: "/admin/users",
    },
    {
        name: "Tests",
        icon: <TestIcon />,
        path: "/admin/tests",
    },
    {
        name: 'Create Test',
        icon: <Create />,
        path: '/admin/tests/create'
    },
    {
        name: 'Assign Test',
        icon: <Assign />,
        path: '/admin/tests/assign'
    }
];

const TabItem = ({ Icon, name }) => {
    return (
        <Stack direction={'row'} spacing={'1rem'} alignItems={'center'}>
            {Icon}
            <Typography variant='body1' sx={{ fontWeight: '600', fontSize: '1.1rem' }}>{name}</Typography>
        </Stack>
    );
}

const SideBar = ({ w = '100%' }) => {
    const location = useLocation();

    return (
        <Stack
            width={{ xs: '100%', sm: '80%', md: w || '70%' }}
            sx={{
                padding: { xs: '1rem', sm: '2rem' },
                height: '100%',
                bgcolor: '#286675',
                position: 'sticky',
                top: '0',
                overflow: 'auto',
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
                onClick={() => window.location.href = '/'}
            >
                OA-Platform
            </Typography>

            {/* Admin Tabs */}
            <Stack spacing={{ xs: '1.5rem', sm: '2rem' }} sx={{ mt: { xs: '2rem', sm: '3rem' } }}>
                {adminTabs.map((tab, i) => (
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
                            color: '#cecfce'
                        }}
                    >
                        <TabItem Icon={tab.icon} name={tab.name} />
                    </Link>
                ))}
            </Stack>
        </Stack>

    );
}


const AdminLayout = () => {
    const { isMobile } = useSelector(state => state.misc);
    const dispatch = useDispatch();
    const handleMobile = () => {
        dispatch(setIsMobile(!isMobile));
    }

    const handleClose = () => dispatch(setIsMobile(false))

    return (
        <Suspense fallback={<AdminLayoutLoader />}>
            <Grid container minHeight={'100vh'} sx={{ bgcolor: '#eff7f9' }}>
                <Box sx={{ display: { xs: 'block', sm: 'none' }, position: 'fixed', right: '1rem', top: '0.5rem', zIndex: 100 }}>
                    <IconButton onClick={handleMobile}>
                        {isMobile ? <CloseIcon /> : <MenuIcon />}
                    </IconButton>
                </Box>
                <Grid item xs={12} sm={4} md={3} lg={2} sx={{
                    display: { xs: 'none', sm: 'block' },
                }}>
                    <SideBar />
                </Grid>
                <Grid item xs={12} sm={8} md={9} lg={10} sx={{ overflowY: 'auto', p: { xs: 2, md: 1 }, height: '100vh', bgcolor: '#eff7f9' }}>
                    <AppBar />
                    <Outlet />
                </Grid>

                <Drawer
                    open={isMobile}
                    onClose={handleClose}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { width: '60vw', maxWidth: '300px' },
                    }}
                >
                    <SideBar />
                </Drawer>
            </Grid>
        </Suspense>
    )
}

export default AdminLayout