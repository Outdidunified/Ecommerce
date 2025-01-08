import React, { useState,useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-custom-alert";
import "react-custom-alert/dist/index.css";
import Mobileview from "../../Components/Mobileview";

const Login = ({ handleLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(""); // To store error message for email validation
  const [passwordError, setPasswordError] = useState(""); // To store error message for password validation
    const [isLoading, setIsLoading] = useState(true);

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email validation regex

  const navigate = useNavigate();
   useEffect(() => {
      // Set a timeout to stop the loader after 2 seconds
      const timer = setTimeout(() => {
        setIsLoading(false); // Hide loader and show content
      }, 1000); // 1 second delay
  
      // Cleanup the timeout on component unmount
      return () => clearTimeout(timer);
    }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      return; // Prevent form submission if email is invalid
    }

    setEmailError(""); // Reset email error if email is valid

    // Validate password
    if (!passwordRegex.test(password)) {
      setPasswordError("Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.");
      return; // Prevent form submission if password is invalid
    }

    setPasswordError(""); // Reset password error if password is valid

    try {
      const response = await axios.post("/user/signin", {
        email_id: email,
        password: password,
      });

      if (response.status === 200) {
        console.log(response);

        // Extract token and user data from the response
        const token = response.data.token;
        const userdata = {
          user_id: response.data.user_id,
          user_name: response.data.username,
          user_email: response.data.email_id,
          user_password: response.data.password,
          role: response.data.role_id,
          usertype: response.data.user_type,
        };
   

        // Store the token and user info in localStorage
        localStorage.setItem("authToken", token);
        localStorage.setItem("userdata", JSON.stringify(userdata));

       


        // Show success message
        toast.success("Login successful! Welcome to Fastkart.");

        // Navigate to the home page after 2 seconds
        setTimeout(() => {
          navigate("/");
        }, 2000);

        // Call the login handler to update app state
        handleLogin(token, userdata);
      } else {
        toast.error("Login failed: Invalid credentials");
      }
    } catch (error) {
      // Handle error (e.g., show error message)
      console.error("Error logging in:", error.response?.data || error.message);

      // Show error message
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
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

<section className="breadcrumb-section pt-0">
  <div className="container-fluid-lg">
    <div className="row">
      <div className="col-12">
        <div className="breadcrumb-contain">
          <h2 className="mb-2">Log In</h2>
          <nav>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <a href="/">
                  <i className="fa-solid fa-house"></i>
                </a>
              </li>
              <li className="breadcrumb-item active">Log In</li>
            </ol>
          </nav>
        </div>
      </div>
    </div>
  </div>
</section>

<section className="log-in-section background-image-2 section-b-space">
  <div className="container-fluid-lg w-100">
    <div className="row">
      <div className="col-xxl-6 col-xl-5 col-lg-6 d-lg-block d-none ms-auto">
        <div className="image-contain">
          <img
            src="../assets/images/inner-page/log-in.png"
            className="img-fluid"
            alt=""
          />
        </div>
      </div>

      <div className="col-xxl-4 col-xl-5 col-lg-6 col-sm-8 mx-auto">
        <div className="log-in-box">
          <div className="log-in-title">
            <h3>Welcome To Fastkart</h3>
            <h4>Log In Your Account</h4>
          </div>

          <div className="input-box">
            <form className="row g-4" onSubmit={handleSubmit}>
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
                  {emailError && (
                    <div className="text-danger mt-2">{emailError}</div>
                  )}
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
                    required
                  />
                  <label htmlFor="password">Password</label>
                  {passwordError && (
                    <div className="text-danger mt-2">{passwordError}</div>
                  )}
                </div>
              </div>

              <div className="col-12">
                <div className="forgot-box">
                  <div className="form-check ps-0 m-0 remember-box">
                    <input
                      className="checkbox_animated check-box"
                      type="checkbox"
                      id="flexCheckDefault"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexCheckDefault"
                    >
                      Remember me
                    </label>
                  </div>
                  <Link to="/forgotpassword"> Forgot Password?</Link>
                </div>
              </div>

              <div className="col-12">
                <button
                  className="btn btn-animation w-100 justify-content-center"
                  type="submit"
                >
                  Log In
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
                  href="https://www.google.com/"
                  className="btn google-button w-100"
                >
                  <img
                    src="../assets/images/inner-page/google.png"
                    className="blur-up lazyload"
                    alt=""
                  />
                  Log In with Google
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
                  Log In with Facebook
                </a>
              </li>
            </ul>
          </div>

          <div className="sign-up-box">
            <h4>Don't have an account?</h4>
            <Link to="/register">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

{/* Toast Notifications */}
<ToastContainer />

<Footer />
        </>
      )}
  
    </div>
  );
};

export default Login;
