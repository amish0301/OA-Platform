import React from 'react'
import { useParams } from 'react-router-dom'

const Profile = () => {
  const { id } = useParams();
  return (
    <div className='h-screen m-auto block'>
      <h1>Your Profile id : {id}</h1>
    </div>
  )
}

export default Profile