import React, { useState } from 'react'
import { Box, Drawer, Grid, IconButton, Stack, Typography, styled } from '@mui/material'
import { MdDashboard as DashboardIcon, MdMenu as MenuIcon, MdManageAccounts as ManageAccountsIcon, MdLogout as ExitToAppIcon } from "react-icons/md";
import { GrDocumentTest as TestIcon } from "react-icons/gr";
import { useSelector, useDispatch } from "react-redux";

import { useLocation, Link as LinkComponent, Navigate, Outlet } from 'react-router-dom'
import { toast } from 'react-toastify';
import axiosInstance from '../hooks/useAxios';
import { userExists } from '../redux/slices/userSlice';
import Loader from '../components/Loader';

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
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const logoutHandler = async () => {
        try {
            setIsLoading(true);
            const res = await axiosInstance.get('/admin/logout');

            if (res.data.success) {
                toast.success(res.data.message);
                dispatch(userExists({ ...res.data.user, isAdmin: false }));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) return <Loader show={isLoading} size={70} color='#3a1c71' />

    return (
        <Stack width={w} sx={{ padding: '2rem', height: '100vh' }} spacing={'2rem'}>
            <Typography variant='h5' textTransform={'uppercase'}>OA-Platform</Typography>

            {/* admin tabs */}
            <Stack spacing={'2rem'} style={{ marginTop: '3rem' }}>
                {
                    adminTabs.map((tab, i) => (
                        <Link key={tab.path} to={tab.path} sx={location.pathname === tab.path && {
                            bgcolor: '#030303',
                            color: 'white'
                        }}>
                            <TabItem Icon={tab.icon} name={tab.name} />
                        </Link>
                    ))
                }
            </Stack>

            <Link onClick={logoutHandler}>
                <TabItem Icon={<ExitToAppIcon />} name={'Logout'} />
            </Link>
        </Stack>
    );
}


const AdminLayout = () => {
    const [isMobile, setIsMobile] = useState(false);
    const handleMobile = () => {
        setIsMobile(!isMobile);
    }

    const isAdmin = useSelector(state => state.user.user?.isAdmin)
    // const hadnleClose = () => setIsMobile(false);

    if (!isAdmin) return <Navigate to={'/admin/login'} />

    return (
        <Grid container minHeight={'100vh'} sx={{ bgcolor: '#eff7f9' }}>
            <Box sx={{ display: { xs: 'block', sm: 'none' }, position: 'fixed', right: '1rem', top: '0.5rem' }}>
                <IconButton onClick={handleMobile}>
                    {isMobile ? <CloseIcon /> : <MenuIcon />}
                </IconButton>
            </Box>
            <Grid item md={4} lg={3} sx={{ display: { xs: 'none', sm: 'block' } }}>
                <SideBar />
            </Grid>
            <Grid item xs={12} md={8} lg={9}>
                <Outlet />
            </Grid>

            {/* <Drawer open={isMobile} onClose={hadnleClose}>
                <SideBar w={'50vw'} />
            </Drawer> */}
        </Grid>
    )
}

export default AdminLayout