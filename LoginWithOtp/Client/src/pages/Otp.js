import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Otp = () => {
  const [otp, setOtp] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();

    if (otp === '') {
      toast.error('Enter Your OTP');
      return;
    }

    if (!/^[0-9]{6}$/.test(otp)) {
      toast.error('Enter Valid OTP');
      return;
    }

    try {
      const response = await axios.post('http://localhost:9000/api/user/login', {
        otp,
        email: location.state,
      });
      console.log(response.data)

      if (response.status === 200) {
        localStorage.setItem('userdbtoken', response.data.token);
        toast.success(response.data.message);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        toast.error(response.response.data.error);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <section>
        <div className="form_data">
          <div className="form_heading">
            <h1>Please Enter Your OTP Here</h1>
          </div>
          <form>
            <div className="form_input">
              <label htmlFor="otp">OTP</label>
              <input
                type="text"
                name="otp"
                id=""
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter Your OTP"
              />
            </div>
            <button className="btn" onClick={loginUser}>
              Submit
            </button>
          </form>
        </div>
        <ToastContainer />
      </section>
    </>
  );
};

export default Otp;
