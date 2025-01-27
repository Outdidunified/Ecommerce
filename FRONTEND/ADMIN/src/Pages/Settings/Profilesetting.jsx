import React, { useState, useEffect } from "react";
import "remixicon/fonts/remixicon.css";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/footer";
import { ToastContainer, toast } from "react-custom-alert"; // Importing react-custom-alert
import "react-custom-alert/dist/index.css"; // Import css file from root.

const Profilesetting = ({ handleLogout, adminData }) => {
  // State for managing editable fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [roleId, setRoleId] = useState("");
  const [usernameError, setUsernameError] = useState(""); // To store username validation error
  const [passwordError, setPasswordError] = useState(""); // To store password validation error

  const token = sessionStorage.getItem("authToken"); // Retrieve token from sessionStorage

  useEffect(() => {
    // Fetch user profile data using the user_id
    const fetchUserData = async () => {
      try {
        // Send `user_id` in the body of the POST request
        const response = await fetch('/admin/get', {
          method: "POST", // Use POST to send data in the body
          headers: {
            "Content-Type": "application/json", // Indicate that the body is JSON
            Authorization: `Bearer ${token}`, // Ensure the token is included in the header
          },
          body: JSON.stringify({ user_id: adminData.admin_id }), // Send the `user_id` in the request body
        });

        const data = await response.json();

        if (response.ok) {
          // Set the data to the state
          setUsername(data.user.username); // Mapping username from response
          setPassword(data.user.password); // Mapping password from response
          setEmail(data.user.email_id); // Mapping email from response
          setRole(data.user.role_name); // Mapping role from response
          setRoleId(data.user.role_id); // Mapping role id from response
        } else {
          throw new Error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data.");
      }
    };

    fetchUserData();
  }, [adminData.admin_id, token]); // Dependency array ensures this runs only when adminData.admin_id changes

  // Validation function for username and password
  const validateInputs = () => {
    let valid = true;

    // Username validation: max 20 characters
    if (username.length > 20) {
      setUsernameError("Username cannot exceed 20 characters.");
      valid = false;
    } else {
      setUsernameError(""); // Clear the error if valid
    }

    // Password validation: minimum 6 characters, at least one special char, one upper case, one lower case
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
    if (!passwordPattern.test(password)) {
      setPasswordError(
        "Password must be at least 6 characters, with one uppercase letter, one lowercase letter, and one special character."
      );
      valid = false;
    } else {
      setPasswordError(""); // Clear the error if valid
    }

    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // First, validate the inputs
    if (!validateInputs()) {
      toast.error("Please fix the validation errors.");
      return;
    }

    // Create the data object to send to the API
    const data = {
      username,
      password,
      user_type: roleId,
      user_id: adminData.admin_id,
      modified_by: adminData.admin_name, // Set 'modified_by' dynamically as needed
    };

    try {
      // Make the API call to the /admin/settings endpoint with the token in headers
      const response = await fetch("/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      // Handle the success response
      if (response.status === 200) {
        // Success response
        console.log("Response:", result);
        toast.success("Profile updated successfully!"); // Success toast
      } else {
        // Error response
        console.error("Error updating profile:", result.message || "Failed to update profile");
        toast.error(result.message || "Failed to update profile!"); // Error toast
      }
    } catch (error) {
      // Handle the error response
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile!"); // Error toast
    }
  };

  return (
    <div>
      {/* Page-wrapper Start */}
      <div className="page-wrapper compact-wrapper" id="pageWrapper">
        {/* Page Header Start */}
        <Header handleLogout={handleLogout} adminData={adminData} />
        {/* Page Header Ends */}

        {/* Page Body Start */}
        <div className="page-body-wrapper">
          {/* Page Sidebar Start */}
          <Sidebar />
          {/* Page Sidebar Ends */}

          {/* Container-fluid starts */}
          <div className="page-body">
            <div className="container-fluid">
              <div className="row">
                <div className="col-12">
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="card">
                        <div className="card-body">
                          <div className="title-header option-title">
                            <h5>Profile Setting</h5>
                          </div>
                          <form
                            className="theme-form theme-form-2 mega-form"
                            onSubmit={handleSubmit}
                          >
                            <div className="row">
                              {/* User Name Field */}
                              <div className="mb-4 row align-items-center">
                                <label className="form-label-title col-sm-2 mb-0">
                                  User Name
                                </label>
                                <div className="col-sm-10">
                                  <input
                                    className="form-control"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Admin Name"
                                    style={{
                                      border: "2px solid green", // Green border for editable fields
                                    }}
                                  />
                                  {usernameError && (
                                    <div className="text-danger">{usernameError}</div>
                                  )}
                                </div>
                              </div>

                              {/* Email Address Field */}
                              <div className="mb-4 row align-items-center">
                                <label className="form-label-title col-sm-2 mb-0">
                                  Email Address
                                </label>
                                <div className="col-sm-10">
                                  <input
                                    className="form-control"
                                    type="email"
                                    value={email}
                                    readOnly
                                    placeholder="Email Address"
                                  />
                                </div>
                              </div>

                              {/* Role Field */}
                              <div className="mb-4 row align-items-center">
                                <label className="form-label-title col-sm-2 mb-0">
                                  Role
                                </label>
                                <div className="col-sm-10">
                                  <input
                                    className="form-control"
                                    type="text"
                                    value={role}
                                    readOnly
                                    placeholder="Role"
                                  />
                                </div>
                              </div>

                              {/* Role Id */}
                              <div className="mb-4 row align-items-center">
                                <label className="form-label-title col-sm-2 mb-0">
                                  Role Id
                                </label>
                                <div className="col-sm-10">
                                  <input
                                    className="form-control"
                                    type="text"
                                    value={roleId}
                                    readOnly
                                    placeholder="Role Id"
                                  />
                                </div>
                              </div>

                              {/* Password Field */}
                              <div className="mb-4 row align-items-center">
                                <label className="form-label-title col-sm-2 mb-0">
                                  Password
                                </label>
                                <div className="col-sm-10">
                                  <input
                                    className="form-control"
                                    type="text" // Always show password in plain text
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    style={{
                                      border: "2px solid green", // Green border for editable fields
                                    }}
                                  />
                                  {passwordError && (
                                    <div className="text-danger">{passwordError}</div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="row justify-content-center mt-4">
                              <div className="col-auto">
                                <button
                                  type="submit"
                                  className="btn btn-primary btn-lg"
                                >
                                  Submit
                                </button>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Footer />
          </div>
        </div>
        {/* page-wrapper End */}
      </div>
      <ToastContainer />
      {/* Page-wrapper End */}
    </div>
  );
};

export default Profilesetting;
