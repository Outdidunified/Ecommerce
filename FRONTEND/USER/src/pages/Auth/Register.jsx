import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import Mobileview from "../../Components/Mobileview";
import { ToastContainer, toast } from "react-custom-alert";
import "react-custom-alert/dist/index.css";

const Register = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [passwordError, setPasswordError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [termsError, setTermsError] = useState("");

  const navigate = useNavigate();

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]{2,14}$/;
  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

  const [formData, setFormData] = useState({
    username: "",
    email_id: "",
    password: "",
    termsAccepted: false,
    user_type: "user", // Default value
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: type === "checkbox" ? checked : value,
    }));

    // Reset errors on valid input
    if (id === "username" && usernameRegex.test(value)) {
      setUsernameError("");
    }
    if (id === "email_id" && emailRegex.test(value)) {
      setEmailError("");
    }
    if (id === "password" && passwordRegex.test(value)) {
      setPasswordError("");
    }
    if (id === "termsAccepted" && checked) {
      setTermsError("");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate username
    if (!usernameRegex.test(formData.username)) {
      setUsernameError(
        "Username must be at least 3-15 characters long and contain only letters and numbers."
      );
      return;
    }

    // Validate email
    if (!emailRegex.test(formData.email_id)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    // Validate password
    if (!passwordRegex.test(formData.password)) {
      setPasswordError(
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
      );
      return;
    }

    // Validate terms acceptance
    if (!formData.termsAccepted) {
      setTermsError("You must accept the terms and privacy policy.");
      return;
    }

    const registerData = {
      username: formData.username,
      email_id: formData.email_id,
      password: formData.password,
      user_type: formData.user_type,
    };

    try {
      const response = await axios.post("/user/signup", registerData);

      if (response.status === 200) {
        toast.success("Registration successful! Redirecting to login page...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        const errorMessage =
          response.data?.message || "An unexpected error occurred.";
        toast.error(errorMessage);
      }
    } catch (err) {
      // Handle non-200 status codes or network errors
      const errorMessage =
        err.response?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div>
      {isLoading ? (
        <div className="fullpage-loader">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      ) : (
        <>
          <Header />
          <Mobileview />

          <section className="breadcrumb-section pt-0">
            <div className="container-fluid-lg">
              <div className="row">
                <div className="col-12">
                  <div className="breadcrumb-contain">
                    <h2>Sign In</h2>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="log-in-section section-b-space">
            <div className="container-fluid-lg w-100">
              <div className="row">
                <div className="col-xxl-6 col-xl-5 col-lg-6 d-lg-block d-none ms-auto">
                  <div className="image-contain">
                    <img
                      src="../assets/images/inner-page/sign-up.png"
                      className="img-fluid"
                      alt=""
                    />
                  </div>
                </div>

                <div className="col-xxl-4 col-xl-5 col-lg-6 col-sm-8 mx-auto">
                  <div className="log-in-box">
                    <div className="log-in-title">
                      <h3>Welcome To Fastkart</h3>
                      <h4>Create New Account</h4>
                    </div>

                    <div className="input-box">
                      <form className="row g-4" onSubmit={handleRegister}>
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
                            {usernameError && (
                              <div className="text-danger mt-2">
                                {usernameError}
                              </div>
                            )}
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
                            {emailError && (
                              <div className="text-danger mt-2">
                                {emailError}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="col-12">
                          <div className="form-floating theme-form-floating">
                            <input
                              type="text"
                              className="form-control"
                              id="password"
                              placeholder="Password"
                              value={formData.password}
                              onChange={handleChange}
                              maxLength={15} // Enforces the limit at the input level
                              required
                            />
                            <label htmlFor="password">Password</label>
                            {passwordError && (
                              <div className="text-danger mt-2">
                                {passwordError}
                              </div>
                            )}
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
                                onChange={handleChange}
                                required
                              />
                              <label
                                className="form-check-label"
                                htmlFor="termsAccepted"
                              >
                                I agree with <span>Terms</span> and{" "}
                                <span>Privacy</span>
                              </label>
                              {termsError && !formData.termsAccepted && (
                                <div className="text-danger mt-2">
                                  {termsError}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="col-12">
                          <button
                            className="btn btn-animation w-100"
                            type="submit"
                          >
                            Sign Up
                          </button>
                        </div>
                      </form>
                    </div>

                    <div className="other-log-in">
                      <h6>or</h6>
                    </div>

                    <div className="log-in-button">
                      <ul>
                        <li>
                          <a
                            href="https://accounts.google.com/signin/v2/identifier?flowName=GlifWebSignIn&flowEntry=ServiceLogin"
                            className="btn google-button w-100"
                          >
                            <img
                              src="../assets/images/inner-page/google.png"
                              className="blur-up lazyload"
                              alt=""
                            />
                            Sign up with Google
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://www.facebook.com/"
                            className="btn google-button w-100"
                          >
                            <img
                              src="../assets/images/inner-page/facebook.png"
                              className="blur-up lazyload"
                              alt=""
                            />
                            Sign up with Facebook
                          </a>
                        </li>
                      </ul>
                    </div>

                    <div className="sign-up-box">
                      <h4>Already have an account?</h4>
                      <Link to="/login">Log In</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <Footer />
          <ToastContainer />
        </>
      )}
    </div>
  );
};

export default Register;
