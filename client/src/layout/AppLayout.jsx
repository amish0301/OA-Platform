import React, { Fragment } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

const AppLayout = () => {
    return (
        <Fragment>
            {/* Navigation */}
            <Navbar />
            {/* Content */}
            <Outlet />
            {/* Footer */}
            <Footer />
        </Fragment>
    )
}

export default AppLayout