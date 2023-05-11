import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {

  const navigate = useNavigate();

  const userValid = () => {
    let token = localStorage.getItem("userdbtoken");
    if (token) {
      console.log("user valid")
    } else {
      navigate("*")
    }
  }

  useEffect(() => {
    userValid();
  })

  const handleLogout = () =>{
    localStorage.removeItem("userdbtoken")
    navigate("/")
  }
  return (
    <>

    <div>Dashboard</div>
    <button  onClick={handleLogout}>Log-out</button>
    </>
  )
}

export default Dashboard