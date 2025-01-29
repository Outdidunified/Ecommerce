import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from "react-custom-alert";
import "react-custom-alert/dist/index.css";

const Login = ({ handleLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, ] = useState('');
      const [passwordError, setPasswordError] = useState('');
      const [emailError, setEmailError] = useState('');
    const navigate = useNavigate();

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

    const Loginfunction = async (e) => {
        e.preventDefault(); // Prevent form submission

         // Validate email
    if (!emailRegex.test(email)) {
        setEmailError('Please enter a valid email address.');
        return;
      }
  
      // Validate password
      if (!passwordRegex.test(password)) {
        setPasswordError('Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.');
        return;
      }
  
        try {
            // Make the POST request to the backend
            const response = await axios.post('admin/signin', {
                email_id: email,
                password: password,
            });
    
            if (response.status === 200) {
                console.log(response);
    
                // Extract token and admin data from the response
                const token = response.data.token;
                const adminData = {
                    admin_id: response.data.user_id,
                    admin_name: response.data.username,
                    admin_email: response.data.email_id,
                    admin_password:response.data.password,
                    role : response.data.role_id
                };
    
                // Store the token and user info in sessionStorage
                sessionStorage.setItem('authToken', token);
                sessionStorage.setItem('adminData', JSON.stringify(adminData));
    
                // Call the login handler to update app state
                handleLogin(token, adminData);
    
                // Redirect to the dashboard
                navigate('/dashboard');
            } else {
                toast.error('Login failed: Invalid credentials');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        }
    };
    


    return (
        <div>
            <section className="log-in-section section-b-space">
                <a href="/" className="logo-login">
                    <img src="/assets/images/logo/1.png" className="img-fluid" alt="Logo" />
                </a>
                <div className="container w-100">
                    <div className="row">
                        <div className="col-xl-5 col-lg-6 me-auto">
                            <div className="log-in-box">
                                <div className="log-in-title">
                                    <h3>Welcome To Fastkart</h3>
                                    <h4>Log In Your Account</h4>
                                </div>
                                <form className="row g-4" onSubmit={Loginfunction}>
                                    <div className="col-12">
                                        <div className="form-floating theme-form-floating log-in-form">
                                            <input
                                                type="email"
                                                className="form-control"
                                                id="email"
                                                placeholder="Email Address"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                            <label htmlFor="email">Email Address</label>
                                            {emailError && <div className="text-danger mt-2">{emailError}</div>}
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-floating theme-form-floating log-in-form">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="password"
                                                placeholder="Password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                maxLength={15} // Enforces the limit at the input level
                                                required
                                            />
                                            <label htmlFor="password">Password</label>
                                            {passwordError && <div className="text-danger mt-2">{passwordError}</div>}
                                        </div>
                                    </div>
                                    {errorMessage && (
                                        <div className="col-12">
                                            <div className="alert alert-danger" role="alert">
                                                {errorMessage}
                                            </div>
                                        </div>
                                    )}
                                    <div className="col-12">
                                        <button type="submit" className="btn btn-animation w-100 justify-content-center">
                                            Log In
                                        </button>
                                        <h5 className="new-page mt-3 text-center">
                                            Don't have an account? <Link to="/Register">Create an account</Link>
                                        </h5>
                                    </div>
                                </form>
                                <div className="other-log-in">
                                    <h6>or</h6>
                                </div>
                                <div className="log-in-button">
                                    <ul>
                                        <li>
                                            <a href="https://www.google.com/" className="btn google-button w-100">
                                                <img src="/assets/images/inner-page/google.png" alt="Google" /> Sign up with
                                                Google
                                            </a>
                                        </li>
                                        <li>
                                            <a href="https://www.facebook.com/" className="btn google-button w-100">
                                                <img src="/assets/images/inner-page/facebook.png" alt="Facebook" /> Log In
                                                with Facebook
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

export default Login;
