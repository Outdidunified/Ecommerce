import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'admin', // Default role
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleRegister = async (e) => {
    const registerData = {
      username: formData.username,
      email_id: formData.email,
      password: formData.password,
      user_type: formData.role,
    };
    e.preventDefault();
    try {
      const response = await axios.post('http://192.168.1.41:6382/admin/signup', registerData);
      if (response.status === 200) {
        setSuccess('Registration successful! Redirecting to login page...');
        
        
        // Wait for the success message to be displayed, then navigate
        setTimeout(() => navigate('/'), 2000); // Redirect after 2 seconds
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
     
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
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="forgot-box">
                        <div className="form-check ps-0 m-0 remember-box">
                          <input
                            className="checkbox_animated check-box"
                            type="checkbox"
                            id="termsCheckbox"
                            required
                          />
                          <label className="form-check-label" htmlFor="termsCheckbox">
                            I accept the terms and privacy policy.
                          </label>
                        </div>
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
    </div>
  );
};

export default Register;
