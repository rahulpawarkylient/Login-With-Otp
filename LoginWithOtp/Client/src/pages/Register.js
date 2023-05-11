import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../styles/mix.css";

const Register = () => {
  const [passhow, setPassShow] = useState(false);

  const [inputdata, setInputdata] = useState({
    fname: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputdata({ ...inputdata, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fname, email, password } = inputdata;

    if (fname === "") {
      toast.error("Enter Your Name");
    } else if (email === "") {
      toast.error("Enter Your Email");
    } else if (
      !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(password)
    ) {
      toast.error(
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number"
      );
    } else if (password === "") {
      toast.error("Enter Your Password");
    } else {
      try {
        const response = await axios.post(
          "http://localhost:9000/api/user/register",
          { fname, email, password }
        );
        console.log(response.data);

        if (response.status === 200) {
          toast.success("Registration successful");
          setInputdata({ fname: "", email: "", password: "" });
          navigate("/");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast.error(error.response.data.message);
        } else {
          toast.error(
            "An error occurred while registering. Please Check Your Details."
          );
        }
      }
    }
  };

  return (
    <>
      <section>
        <div className="form_data">
          <div className="form_heading">
            <h1>Sign Up</h1>
            <p style={{ textAlign: "center" }}>
              We are glad that you will be using Project Cloud to manage your
              tasks! We hope that you will like it.
            </p>
          </div>
          <form>
            <div className="form_input">
              <label htmlFor="fname">Name</label>
              <input
                type="text"
                name="fname"
                id=""
                onChange={handleChange}
                placeholder="Enter Your Name"
              />
            </div>
            <div className="form_input">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id=""
                onChange={handleChange}
                placeholder="Enter Your Email Address"
              />
            </div>
            <div className="form_input">
              <label htmlFor="password">Password</label>
              <div className="two">
                <input
                  type={passhow ? "text" : "password"}
                  name="password"
                  id=""
                  onChange={handleChange}
                  placeholder="Enter Your Password"
                />
                <div className="showpass" onClick={() => setPassShow(!passhow)}>
                  {passhow ? "Hide" : "Show"}
                </div>
              </div>
            </div>

            <button className="btn" onClick={handleSubmit}>
              Sign Up
            </button>
            <p>
              You already have an account?{" "}
              <Link to="/">
                <span>Login</span>
              </Link>{" "}
            </p>
          </form>
        </div>
        <ToastContainer />
      </section>
    </>
  );
};

export default Register;
