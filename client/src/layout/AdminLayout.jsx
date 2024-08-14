import React, { useState } from 'react'
import { Box, Drawer, Grid, IconButton, Stack, Typography, styled } from '@mui/material'
import {  MdDashboard as DashboardIcon, MdMenu as MenuIcon, MdManageAccounts as ManageAccountsIcon, MdLogout as ExitToAppIcon } from "react-icons/md";
import { GrDocumentTest as TestIcon } from "react-icons/gr";

import { useLocation, Link as LinkComponent, Navigate } from 'react-router-dom'

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
            <Typography variant='body1' sx={{ fontWeight: '600' }}>{name}</Typography>
        </Stack>
    );
}

const SideBar = ({ w = '100%' }) => {
    const location = useLocation();
    const logoutHandler = () => {
        console.log('logout');
    }

    return (
        <Stack w={w} p={'2rem'} spacing={'2rem'}>
            <Typography variant='h5' textTransform={'uppercase'}>OA-Platform</Typography>

            {/* admin tabs */}
            <Stack spacing={'2rem'}>
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

const isAdmin = true;

const AdminLayout = ({ children }) => {
    const [isMobile, setIsMobile] = useState(false);
    const handleMobile = () => {
        setIsMobile(!isMobile);
    }
    const hadnleClose = () => setIsMobile(false);

    if(!isAdmin) return <Navigate to={'/admin'}/>

    return (
        <Grid container minHeight={'100vh'}>
            <Box sx={{ display: { xs: 'block', sm: 'none', position: 'fixed', right: '1rem', top: '0.5rem' } }}>
                <IconButton onClick={handleMobile}>
                    {isMobile ? <CloseIcon /> : <MenuIcon />}
                </IconButton>
            </Box>
            <Grid item md={4} lg={3} sx={{ display: { xs: 'none', sm: 'block' }}}>
                <SideBar />
            </Grid>
            <Grid item xs={12} md={8} lg={9} sx={{ bgcolor: '#f5f5f5'}}>
                {children}
            </Grid>

            {/* <Drawer open={isMobile} onClose={hadnleClose}>
                <SideBar w={'50vw'} />
            </Drawer> */}
        </Grid>
    )
}

export default AdminLayout