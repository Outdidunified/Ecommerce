import React, { useState, useEffect } from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import axios from "axios";
import { ToastContainer, toast } from "react-custom-alert";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "react-custom-alert/dist/index.css";
import Mobileview from "../../Components/Mobileview";

const Forgotpassword = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState(""); // State for email input
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Set a timeout to stop the loader after 2 seconds
    const timer = setTimeout(() => {
      setIsLoading(false); // Hide loader and show content
    }, 1000); // 1 second delay

    // Cleanup the timeout on component unmount
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    try {
      const response = await axios.post("/user/forgotPassword", {
        email_id: email, // Send email_id in the request body
      });

      if (response.status === 200) {
        toast.success("Password reset link has been sent to your email.");
        // Navigate to OTP page on success
        navigate("/otp", { state: { email_id: email } });
      } else {
        toast.error("Failed to send password reset link.");
      }
    } catch (error) {
      console.error("Error in password reset:", error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false); // Reset loading state
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

          {/* Breadcrumb Section Start */}
          <section className="breadcrumb-section pt-0">
            <div className="container-fluid-lg">
              <div className="row">
                <div className="col-12">
                  <div className="breadcrumb-contain">
                    <h2>Forgot Password</h2>
                    <nav>
                      <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item">
                          <a href="index.html">
                            <i className="fa-solid fa-house"></i>
                          </a>
                        </li>
                        <li className="breadcrumb-item active">Forgot Password</li>
                      </ol>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Breadcrumb Section End */}

          {/* log in section start */}
          <section className="log-in-section section-b-space forgot-section">
            <div className="container-fluid-lg w-100">
              <div className="row">
                <div className="col-xxl-6 col-xl-5 col-lg-6 d-lg-block d-none ms-auto">
                  <div className="image-contain">
                    <img
                      src="../assets/images/inner-page/forgot.png"
                      className="img-fluid"
                      alt=""
                    />
                  </div>
                </div>

                <div className="col-xxl-4 col-xl-5 col-lg-6 col-sm-8 mx-auto">
                  <div className="d-flex align-items-center justify-content-center h-100">
                    <div className="log-in-box">
                      <div className="log-in-title">
                        <h3>Welcome To Fastkart</h3>
                        <h4>Forgot your password</h4>
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
                                onChange={(e) => setEmail(e.target.value)} // Update email state on input change
                                required
                              />
                              <label htmlFor="email">Email Address</label>
                            </div>
                          </div>

                          <div className="col-12">
                            <button className="btn btn-animation w-100" type="submit">
                              Forgot Password
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* log in section end */}
          <Footer />
          <ToastContainer />
        </>
      )}
    </div>
  );
};

export default Forgotpassword;
