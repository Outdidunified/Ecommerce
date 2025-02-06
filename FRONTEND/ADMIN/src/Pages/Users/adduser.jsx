import React, { useState, useEffect } from "react";
import "remixicon/fonts/remixicon.css";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/footer";
import axios from "axios";
import { ToastContainer, toast } from "react-custom-alert";
import "react-custom-alert/dist/index.css";

const AddUser = ({ handleLogout, adminData }) => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("authToken");

  const [formData, setFormData] = useState({
    username: "",
    email_id: "",
    password: "",
    user_type: "",
    role_id: "",
    address: "",
    pincode: "",
    phone: "",
    country: "",
    state: "",
    created_by: adminData.admin_name,
  });

  const [roles, setRoles] = useState([]);
  const [errors, setErrors] = useState({});

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]{2,14}$/;
  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
  const digitOnlyRegex = /^\d*$/;

  useEffect(() => {
    axios
      .get("/roles")
      .then((response) => {
        const activeRoles = response.data.filter((role) => role.status === 1);
        setRoles(activeRoles);
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
      });
  }, []);
  

  const validateField = (name, value) => {
    let error = "";
    value = String(value);  // Ensure that value is a string before calling trim()
    
    switch (name) {
      case "username":
        if (!value.trim()) {
          error = "Username is required.";
        } else if (!usernameRegex.test(value)) {
          error =
            "Username must start with a letter and be 3-15 characters long.";
        }
        break;
      case "email_id":
        if (!value.trim()) {
          error = "Email is required.";
        } else if (!emailRegex.test(value)) {
          error = "Invalid email format.";
        }
        break;
      case "password":
        if (!value.trim()) {
          error = "Password is required.";
        } else if (!passwordRegex.test(value)) {
          error =
            "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.";
        }
        break;
      case "phone":
        if (!value.trim()) {
          error = "Phone number is required.";
        } else if (!digitOnlyRegex.test(value) || value.length !== 10) {
          error = "Phone number must be exactly 10 digits.";
        }
        break;
      case "pincode":
        if (!value.trim()) {
          error = "Pincode is required.";
        } else if (!digitOnlyRegex.test(value) || value.length < 6) {
          error = "Pincode must be at least 6 digits.";
        }
        break;
      case "address":
        if (!value.trim()) {
          error = "Address is required.";
        }
        break;
        case "country":
          if (!value.trim()) {
            error = "Country is required.";
          } else if (!/^[A-Za-z\s]+$/.test(value)) {
            error = "Country should contain only alphabets.";
          }
          break;
        
      case "state":
        if (!value.trim()) {
          error = "State is required.";
        }else if (!/^[A-Za-z\s]+$/.test(value)) {
          error = "State should contain only alphabets.";
        }
        break;
      default:
        if (!value.trim()) {
          error = `${name.replace("_", " ")} is required.`;
        }
    }
    return error;
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle phone and pincode validation
    if ((name === "phone" || name === "pincode") && !digitOnlyRegex.test(value)) {
      return; // Prevent non-digit input for phone and pincode
    }

    // If the field is user_type, update role_id based on selected user type
    if (name === "user_type") {
      const selectedRole = roles.find((role) => role.role_name === value);
      setFormData((prev) => ({
        ...prev,
        user_type: value,
        role_id: selectedRole ? selectedRole.role_id : "",
      }));
    } else {
      // Otherwise, just update formData for other fields
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Update errors state for validation
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validateField(name, value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const validationErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        validationErrors[field] = error;
      }
    });
  
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    axios
      .post("/admin/adduser", formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.status === 200) {
          toast.success("User added successfully!");
  
          // Wait for 2 seconds before navigating
          setTimeout(() => {
            navigate("/allusers");
          }, 2000);
        }
      })
      .catch((error) => {
        if (error.response) {
          // Extract the error message from the backend response
          const backendMessage = error.response.data.message || "An error occurred.";
          if (error.response.status === 400) {
            toast.error(`${backendMessage}`);
          } else {
            toast.error("Unexpected error occurred.");
          }
        } else {
          // Handle unexpected errors
          console.error("Error adding user:", error);
          toast.error("Failed to add user. Please try again.");
        }
      });
  };
  

  return (
    <div>
      <div className="page-wrapper compact-wrapper" id="pageWrapper">
        <Header handleLogout={handleLogout} adminData={adminData} />
        <div className="page-body-wrapper">
          <Sidebar />
          <div className="page-body">
            <div className="container-fluid">
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Add New User</h5>
                      <form className="theme-form" onSubmit={handleSubmit}>
                        <div className="row">
                          {/* Username */}
                          <div className="col-md-6">
                            <label>Username</label>
                            <input
                              type="text"
                              className="form-control"
                              name="username"
                              value={formData.username}
                              onChange={handleChange}
                              required
                            />
                            {errors.username && (
                              <small className="text-danger">
                                {errors.username}
                              </small>
                            )}
                          </div>

                          {/* Email */}
                          <div className="col-md-6">
  <label>Email</label>
  <input
    type="email"
    className="form-control"
    name="email_id"
    value={formData.email_id}
    onChange={(e) =>
      handleChange({
        target: { name: "email_id", value: e.target.value.toLowerCase() },
      })
    }
    required
  />
  {errors.email_id && (
    <small className="text-danger">{errors.email_id}</small>
  )}
</div>


                          {/* Password */}
                          <div className="col-md-6">
                            <label>Password</label>
                            <input
                              type="text"
                              className="form-control"
                              name="password"
                              value={formData.password}
                              maxLength={15}
                              onChange={handleChange}
                              required
                            />
                            {errors.password && (
                              <small className="text-danger">
                                {errors.password}
                              </small>
                            )}
                          </div>

                          {/* User Type (Role) */}
                          <div className="col-md-6">
                            <label>User Type</label>
                            <select
                              className="form-control"
                              name="user_type"
                              value={formData.user_type}
                              onChange={handleChange}
                              required
                            >
                              <option value="">Select User Type</option>
                              {roles.map((role) => (
                                <option
                                  key={role.role_id}
                                  value={role.role_name}
                                >
                                  {role.role_name}
                                </option>
                              ))}
                            </select>
                            {errors.user_type && (
                              <small className="text-danger">
                                {errors.user_type}
                              </small>
                            )}
                          </div>

                          {/* Address */}
                          <div className="col-md-6">
                            <label>Address</label>
                            <input
                              type="text"
                              className="form-control"
                              name="address"
                              value={formData.address}
                              onChange={handleChange}
                              required
                            />
                            {errors.address && (
                              <small className="text-danger">
                                {errors.address}
                              </small>
                            )}
                          </div>

                          {/* Pincode */}
                          <div className="col-md-6">
                            <label>Pincode</label>
                            <input
                              type="text"
                              className="form-control"
                              name="pincode"
                              value={formData.pincode}
                              onChange={handleChange}
                              maxLength="6"
                              required
                            />
                            {errors.pincode && (
                              <small className="text-danger">
                                {errors.pincode}
                              </small>
                            )}
                          </div>

                          {/* Phone */}
                          <div className="col-md-6">
                            <label>Phone</label>
                            <input
                              type="text"
                              className="form-control"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              maxLength="10"
                              required
                            />
                            {errors.phone && (
                              <small className="text-danger">
                                {errors.phone}
                              </small>
                            )}
                          </div>

                          {/* Country */}
                          <div className="col-md-6">
                            <label>Country</label>
                            <input
                              type="text"
                              className="form-control"
                              name="country"
                              maxLength={15}
                              value={formData.country}
                              onChange={handleChange}
                              required
                            />
                            {errors.country && (
                              <small className="text-danger">
                                {errors.country}
                              </small>
                            )}
                          </div>

                          {/* State */}
                          <div className="col-md-6">
                            <label>State</label>
                            <input
                              type="text"
                              className="form-control"
                              name="state"
                              maxLength={20}
                              value={formData.state}
                              onChange={handleChange}
                              required
                            />
                            {errors.state && (
                              <small className="text-danger">
                                {errors.state}
                              </small>
                            )}
                          </div>

                          {/* Submit */}
                          <div className="col-12 mt-4 d-flex justify-content-center">
                            <button type="submit" className="btn btn-primary">
                              Add User
                            </button>
                          </div>
                        </div>
                      </form>
                      <ToastContainer />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default AddUser;
