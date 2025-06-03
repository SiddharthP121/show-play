import React from 'react'
import {Link, useNavigate } from 'react-router-dom'

const Home = () => {
    const navigate = useNavigate()
    const handleClick = () => {
      navigate("/users/register")
    }
    
  return (
    <div>
      <p>Home</p>
      <button onClick={handleClick}>Signup</button>
    </div>
  )
}

export default Home
