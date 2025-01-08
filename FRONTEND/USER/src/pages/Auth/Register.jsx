import React, { useState,useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import Mobileview from "../../Components/Mobileview";

const Register = () => {
  const [, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(true);

  const [, setError] = useState('');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email_id: "",
    password: "",
    user_type: "user", // Default value
  });

   useEffect(() => {
      // Set a timeout to stop the loader after 2 seconds
      const timer = setTimeout(() => {
        setIsLoading(false); // Hide loader and show content
      }, 1000); // 1 second delay
  
      // Cleanup the timeout on component unmount
      return () => clearTimeout(timer);
    }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const registerData = {
      username: formData.username,
      email_id: formData.email_id, // Corrected field name
      password: formData.password,
      user_type: formData.user_type,
    };
  
    try {
      const response = await axios.post('/user/signup', registerData);
      if (response.status === 200) {
        setSuccess('Registration successful! Redirecting to login page...');
        setTimeout(() => navigate('/login'), 2000); // Redirect after 2 seconds
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    }
  };
  

  return (
    <div>
      {isLoading? (
         <div className="fullpage-loader">
         <span></span>
         <span></span>
         <span></span>
         <span></span>
         <span></span>
         <span></span>
       </div>
      ):(
        <>
            <Header />
     <Mobileview/>

      <section class="breadcrumb-section pt-0">
        <div class="container-fluid-lg">
          <div class="row">
            <div class="col-12">
              <div class="breadcrumb-contain">
                <h2>Sign In</h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="log-in-section section-b-space">
        <div class="container-fluid-lg w-100">
          <div class="row">
            <div class="col-xxl-6 col-xl-5 col-lg-6 d-lg-block d-none ms-auto">
              <div class="image-contain">
                <img
                  src="../assets/images/inner-page/sign-up.png"
                  class="img-fluid"
                  alt=""
                />
              </div>
            </div>

            <div class="col-xxl-4 col-xl-5 col-lg-6 col-sm-8 mx-auto">
              <div class="log-in-box">
                <div class="log-in-title">
                  <h3>Welcome To Fastkart</h3>
                  <h4>Create New Account</h4>
                </div>

                <div class="input-box">
                  <form class="row g-4" onSubmit={handleRegister}>
                    <div className="col-12">
                      <div className="form-floating theme-form-floating">
                        <input
                          type="text"
                          className="form-control"
                          id="username"
                          placeholder="Full Name"
                          value={formData.username}
                          onChange={handleChange}
                          required
                        />
                        <label htmlFor="username">Full Name</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating theme-form-floating">
                        <input
                          type="email"
                          className="form-control"
                          id="email_id"
                          placeholder="Email Address"
                          value={formData.email_id}
                          onChange={handleChange}
                          required
                        />
                        <label htmlFor="email_id">Email Address</label>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-floating theme-form-floating">
                        <input
                          type="password"
                          className="form-control"
                          id="password"
                          placeholder="Password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                        <label htmlFor="password">Password</label>
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="forgot-box">
                        <div class="form-check ps-0 m-0 remember-box">
                          <input
                            class="checkbox_animated check-box"
                            type="checkbox"
                            id="flexCheckDefault"
                          />
                          <label
                            class="form-check-label"
                            for="flexCheckDefault"
                          >
                            I agree with
                            <span>Terms</span> and <span>Privacy</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div class="col-12">
                      <button class="btn btn-animation w-100" type="submit">
                        Sign Up
                      </button>
                    </div>
                  </form>
                </div>

                <div class="other-log-in">
                  <h6>or</h6>
                </div>

                <div class="log-in-button">
                  <ul>
                    <li>
                      <a
                        href="https://accounts.google.com/signin/v2/identifier?flowName=GlifWebSignIn&flowEntry=ServiceLogin"
                        class="btn google-button w-100"
                      >
                        <img
                          src="../assets/images/inner-page/google.png"
                          class="blur-up lazyload"
                          alt=""
                        />
                        Sign up with Google
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.facebook.com/"
                        class="btn google-button w-100"
                      >
                        <img
                          src="../assets/images/inner-page/facebook.png"
                          class="blur-up lazyload"
                          alt=""
                        />
                        Sign up with Facebook
                      </a>
                    </li>
                  </ul>
                </div>

                

                <div class="sign-up-box">
                  <h4>Already have an account?</h4>
                  <Link to="/login">Log In</Link>
                </div>
              </div>
            </div>

            <div class="col-xxl-7 col-xl-6 col-lg-6"></div>
          </div>
        </div>
      </section>

      <Footer />
        </>
      )}
  
    </div>
  );
};

export default Register;
