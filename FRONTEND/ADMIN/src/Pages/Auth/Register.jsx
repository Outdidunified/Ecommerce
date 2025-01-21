import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from "react-custom-alert";
import "react-custom-alert/dist/index.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'admin', // Default role
    termsAccepted: false,
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [termsError, setTermsError] = useState('');
  const navigate = useNavigate();

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]{2,14}$/;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === 'checkbox' ? checked : value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Reset errors
    setUsernameError('');
    setEmailError('');
    setPasswordError('');
    setTermsError('');
    setError('');


    // Validate username
    if (!usernameRegex.test(formData.username)) {
      setUsernameError('Username must be at least 3-15 characters long and contain only letters, numbers, and underscores.');
      return;
    }

    // Validate email
    if (!emailRegex.test(formData.email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    // Validate password
    if (!passwordRegex.test(formData.password)) {
      setPasswordError('Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.');
      return;
    }

    // Validate terms
    if (!formData.termsAccepted) {
      setTermsError('You must accept the terms and privacy policy.');
      return;
    }

    const registerData = {
      username: formData.username,
      email_id: formData.email,
      password: formData.password,
      user_type: formData.role,
    };

    try {
      const response = await axios.post('/admin/signup', registerData);
      if (response.status === 200) {
         toast.success('Registration successful! Redirecting to login page...');
        setTimeout(() => navigate('/'), 2000); // Redirect after 2 seconds
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <section className="log-in-section section-b-space">
        <Link to="/" className="logo-login">
          <img src="assets/images/logo/1.png" className="img-fluid" alt="Fastkart Logo" />
        </Link>
        <div className="container w-100">
          <div className="row">
            <div className="col-xl-5 col-lg-6 me-auto">
              <div className="log-in-box">
                <div className="log-in-title">
                  <h3>Welcome To Fastkart</h3>
                  <h4>Sign Up Your Account</h4>
                </div>

                <div className="input-box">
                  <form className="row g-4" onSubmit={handleRegister}>
                    <div className="col-12">
                      <div className="form-floating theme-form-floating log-in-form">
                        <input
                          type="text"
                          className="form-control"
                          id="username"
                          placeholder="Enter User Name"
                          value={formData.username}
                          onChange={handleInputChange}
                          required
                        />
                        <label htmlFor="username">Username</label>
                        {usernameError && <div className="text-danger mt-2">{usernameError}</div>}
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-floating theme-form-floating log-in-form">
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          placeholder="Email Address"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                        <label htmlFor="email">Email Address</label>
                        {emailError && <div className="text-danger mt-2">{emailError}</div>}
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-floating theme-form-floating log-in-form">
                        <input
                          type="password"
                          className="form-control"
                          id="password"
                          placeholder="Password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                        />
                        <label htmlFor="password">Password</label>
                        {passwordError && <div className="text-danger mt-2">{passwordError}</div>}
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="forgot-box">
                        <div className="form-check ps-0 m-0 remember-box">
                          <input
                            className="checkbox_animated check-box"
                            type="checkbox"
                            id="termsAccepted"
                            checked={formData.termsAccepted}
                            onChange={handleInputChange}
                            required
                          />
                          <label className="form-check-label" htmlFor="termsAccepted">
                            I accept the terms and privacy policy.
                          </label>
                        </div>
                        {termsError && <div className="text-danger mt-2">{termsError}</div>}
                      </div>
                    </div>

                    {error && <p className="text-danger">{error}</p>}
                    {success && <p className="text-success">{success}</p>}

                    <div className="col-12">
                      <button
                        type="submit"
                        className="btn btn-animation w-100 justify-content-center"
                      >
                        Sign Up
                      </button>
                      <h5 className="new-page mt-3 text-center">
                        Already have an account? <Link to="/">Log In</Link>
                      </h5>
                    </div>
                  </form>
                </div>

                <div className="other-log-in">
                  <h6>or</h6>
                </div>

                <div className="log-in-button">
                  <ul>
                    <li>
                      <a href="https://www.google.com/" className="btn google-button w-100">
                        <img
                          src="../assets/images/inner-page/google.png"
                          className="blur-up lazyload"
                          alt="Google"
                        />{' '}
                        Sign up with Google
                      </a>
                    </li>
                    <li>
                      <a href="https://www.facebook.com/" className="btn google-button w-100">
                        <img
                          src="../assets/images/inner-page/facebook.png"
                          className="blur-up lazyload"
                          alt="Facebook"
                        />{' '}
                        Sign up with Facebook
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
        <ToastContainer />
    </div>
  );
};

export default Register;
