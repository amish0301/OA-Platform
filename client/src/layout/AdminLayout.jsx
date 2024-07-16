import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminPanel from '../components/admin/AdminPanel.jsx'

const AdminLayout = () => {
  return (
      <div className='grid grid-cols-2'>
        <AdminPanel />
        <Outlet />
      </div>
  )
}

export default AdminLayout