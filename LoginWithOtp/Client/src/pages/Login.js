import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
import '../styles/mix.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [spinner, setSpinner] = useState(false);
  const navigate = useNavigate();

  // send otp
  const sendOtp = async (e) => {
    e.preventDefault();
    if (email === '') {
      toast.error('Enter Your Email!');
    } else if (!email.includes('@')) {
      toast.error('Enter Valid Email!');
    } else {
      setSpinner(true);
      const response = await axios.post('http://localhost:9000/api/user/sendotp', {
        email,
      });
      if (response.status === 200) {
        setSpinner(false);
        navigate('/user/otp', { state: email });
      } else {
        toast.error(response.response.data.error);
      }
    }
  };

  return (
    <>
      <section>
        <div className="form_data">
          <div className="form_heading">
            <h1>Welcome Back, Log In</h1>
            <p>Hi, we are glad you are back. Please login.</p>
          </div>
          <form>
            <div className="form_input">
              <label htmlFor="email">Email</label>
              <input type="email" name="email" id="" onChange={(e) => setEmail(e.target.value)} placeholder="Enter Your Email Address" />
            </div>
            <button className="btn" onClick={sendOtp}>
              Login
              {spinner ? <span><Spinner animation="border" /></span> : null}
            </button>
            <p>Don't have an account? <NavLink to="/register">Sign up</NavLink></p>
          </form>
        </div>
        <ToastContainer />
      </section>
    </>
  );
};

export default Login;
