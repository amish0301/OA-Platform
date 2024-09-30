import React, { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer.jsx'
import Navbar from '../components/Navbar.jsx'
import { AppLayoutLoader } from './LayoutLoaders.jsx'

const AppLayout = () => {
    return (
        <Suspense fallback={<AppLayoutLoader />}>
            <Navbar />
            <Outlet />
            <Footer />
        </Suspense>
    )
}

export default AppLayout