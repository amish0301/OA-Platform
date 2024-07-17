import React from 'react'

const Home = ({ user }) => {
  return (
    <div>
      {user && <h1>Welcome {user.name}</h1>}
      home
    </div>
  )
}

export default Home