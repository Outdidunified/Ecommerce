import React, { useState, useEffect } from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-custom-alert";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Mobileview from "../../Components/Mobileview";

import "react-custom-alert/dist/index.css";

const Otp = () => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const { email_id } = location.state || {};
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
const [isPasswordMatching, setIsPasswordMatching] = useState(true); // To check if passwords match
 const navigate = useNavigate(); // Initialize useNavigate


  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;
    const newOtp = [...otp];
    if (value.match(/[0-9]/)) {
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < 5) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  const handleBackspace = (e, index) => {
    const newOtp = [...otp];
    if (e.key === "Backspace" && otp[index] !== "") {
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("/user/forgotPassword", { email_id });

      if (response.status === 200) {
        toast.success("Password reset link has been sent to your email.");
      } else {
        toast.error("Failed to send password reset link.");
      }
    } catch (error) {
      console.error("Error in password reset:", error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleotpSubmit = async () => {
    const otpValue = otp.join(""); // Combine the OTP array into a single string
    try {
      const response = await axios.post("/user/otp", {
        otp: otpValue,
        email_id: email_id,
      });

      if (response.status === 200) {
        toast.success("OTP verified successfully.");
        setShowModal(true); // Open the modal to set a new password
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error in OTP verification:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword === confirmPassword) {
      setIsPasswordMatching(true);
      
      try {
        const response = await axios.post("/user/resetpassword", {
          email_id,
          new_password: newPassword,
        });
  
        if (response.status === 200) {
          toast.success("Password reset successful!");
          navigate('/login')
          // Redirect or display a success message
        } else {
          toast.error("Failed to reset password. Please try again.");
        }
      } catch (error) {
        console.error("Error resetting password:", error);
        toast.error("Something went wrong. Please try again later.");
      }
    } else {
      setIsPasswordMatching(false); // Show an error if passwords don't match
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
                    <h2>OTP</h2>
                    <nav>
                      <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item">
                          <a href="index.html">
                            <i className="fa-solid fa-house"></i>
                          </a>
                        </li>
                        <li className="breadcrumb-item active">OTP</li>
                      </ol>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="log-in-section otp-section section-b-space">
            <div className="container-fluid-lg">
              <div className="row">
                <div className="col-xxl-6 col-xl-5 col-lg-6 d-lg-block d-none ms-auto">
                  <div className="image-contain">
                    <img
                      src="../assets/images/inner-page/otp.png"
                      className="img-fluid"
                      alt=""
                    />
                  </div>
                </div>

                <div className="col-xxl-4 col-xl-5 col-lg-6 col-sm-8 mx-auto">
                  <div className="d-flex align-items-center justify-content-center h-100">
                    <div className="log-in-box">
                      <div className="log-in-title">
                        <h3 className="text-title">
                          Please enter the one time password to verify your account
                        </h3>
                        <h5 className="text-content">
                          A code has been sent to <span>{email_id}</span>
                        </h5>
                      </div>

                      <div
                        id="otp"
                        className="inputs d-flex flex-row justify-content-center"
                      >
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            id={`otp-input-${index}`}
                            className="text-center form-control rounded"
                            type="text"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onKeyUp={(e) => handleBackspace(e, index)}
                            placeholder="0"
                          />
                        ))}
                      </div>

                      <div className="send-box pt-4">
                        <h5>
                          Didn't get the code?{" "}
                          <a
                            className="theme-color fw-bold"
                            onClick={handleSubmit}
                            
                          >
                            Resend It
                          </a>
                        </h5>
                      </div>

                      <button
                        onClick={handleotpSubmit}
                        className="btn btn-animation w-100 mt-3"
                        type="submit"
                      >
                        Validate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {showModal && (
            <div className="modal show" style={{ display: "block" }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Set New Password</h5>
                    <button
                      type="button"
                      className="close"
                      data-dismiss="modal"
                      aria-label="Close"
                      onClick={() => setShowModal(false)}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <div className="form-group">
                      <label>New Password</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Confirm Password</label>
                      <input
                        type="text"
                        className="form-control"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                  {!isPasswordMatching && (
        <p className="text-danger">Passwords do not match!</p>
      )}
                   
                  <button
  type="button"
  className="btn btn-animation w-100 mt-3"
  onClick={handlePasswordChange}
  disabled={newPassword === "" || confirmPassword === ""}
>
  Set Password
</button>

                  </div>
                </div>
              </div>
            </div>
          )}

          <ToastContainer />
          <Footer />
        </>
      )}
    </div>
  );
};

export default Otp;
