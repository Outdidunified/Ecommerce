import React, { useState, useEffect } from 'react';
import 'remixicon/fonts/remixicon.css';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { ToastContainer, toast } from 'react-custom-alert';
import 'react-custom-alert/dist/index.css';
import Sidebar from '../../Components/Sidebar/Sidebar';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/footer';
import axios from 'axios';

const AddUser = ({ handleLogout, adminData }) => {
  const navigate = useNavigate(); // Initialize useNavigate
  const token = sessionStorage.getItem("authToken"); // Retrieve token from sessionStorage
  
  const [formData, setFormData] = useState({
    username: '',
    email_id: '',
    password: '',
    userType: '',
    address: '',
    pincode: '',
    phone: '',
    country: '',
    state: '',
    role_id: '',  // Add role_id to formData
    created_by: adminData.admin_name,
  });
  
  const [roles, setRoles] = useState([]); // State to store roles data
  const [loading, setLoading] = useState(true); // State to manage loading

  useEffect(() => {
    // Fetch roles from the API on component mount
    axios.get('/roles')
      .then((response) => {
        setRoles(response.data); // Set the role data to state
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch((error) => {
        console.error('Error fetching roles:', error);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Add token in the Authorization header
      const response = await axios.post('/admin/adduser', formData, {
        headers: {
          'Authorization': `Bearer ${token}` // Passing token in header
        }
      });

      // Handle success, for example:
      alert('User added successfully');
      navigate('/allusers'); // Navigate to /allusers after success
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Failed to add user');
    }
  };

  return (
    <div>
      {/* page-wrapper Start */}
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
                    <div className="col-sm-8 m-auto">
                      <div className="card">
                        <div className="card-body">
                          <div className="title-header option-title">
                            <h5>Add New User</h5>
                          </div>

                          <div className="tab-content" id="pills-tabContent">
                            <div className="tab-pane fade show active" id="pills-home" role="tabpanel">
                              <form className="theme-form theme-form-2 mega-form" onSubmit={handleSubmit}>
                                <div className="card-header-1">
                                  <h5>User Information</h5>
                                </div>

                                <div className="row">
                                  {/* Username */}
                                  <div className="mb-4 row align-items-center">
  <label className="form-label-title col-lg-2 col-md-3 mb-0">Username</label>
  <div className="col-md-9 col-lg-10">
    <input
      className="form-control"
      type="text"
      name="username"
      placeholder="Enter username"
      value={formData.username}
      onChange={handleChange}
      maxLength="15" // Maximum length is 15
      pattern="^[a-zA-Z0-9]+$" // Allow alphanumeric characters (letters and numbers)
      title="Username must be alphanumeric and up to 15 characters long" // Custom message for invalid pattern
    />
    {formData.username.length > 15 && (
      <small className="text-danger">Username cannot exceed 15 characters</small>
    )}
    {!/^[a-zA-Z0-9]+$/.test(formData.username) && formData.username && (
      <small className="text-danger">Username must be alphanumeric</small>
    )}
  </div>
</div>


<div className="mb-4 row align-items-center">
                                    <label className="col-lg-2 col-md-3 col-form-label form-label-title">Email Address</label>
                                    <div className="col-md-9 col-lg-10">
                                      <input
                                        className="form-control"
                                        type="email"
                                        name="email"
                                        placeholder="Enter email address"
                                        value={formData.email}
                                        onChange={handleChange}
                                      />
                                    </div>
                                  </div>

                                  {/* Password */}
<div className="mb-4 row align-items-center">
  <label className="col-lg-2 col-md-3 col-form-label form-label-title">Password</label>
  <div className="col-md-9 col-lg-10">
    <input
      className="form-control"
      type="text" // Change type to "password" for better security
      name="password"
      placeholder="Enter password"
      value={formData.password}
      onChange={handleChange}
      required
      minLength="6" // Minimum password length of 6 characters
      pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$" // Password should have letters and numbers
      title="Password must be at least 6 characters long and contain both letters and numbers."
    />
    {(formData.password.length < 6 && formData.password) && (
      <small className="text-danger">Password must be at least 6 characters long.</small>
    )}
    {!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(formData.password) && formData.password && (
      <small className="text-danger">Password must contain both letters and numbers.</small>
    )}
  </div>
</div>
                                  {/* Role */}
                                  <div className="mb-4 row align-items-center">
                                    <label className="form-label-title col-lg-2 col-md-3 mb-0">User Type</label>
                                    <div className="col-md-9 col-lg-10">
                                      <select
                                        className="form-control"
                                        name="role_id" // Use role_id in formData
                                        value={formData.role_id}
                                        onChange={handleChange}
                                      >
                                        <option value="">Select Role</option>
                                        {/* Loop through roles and create options */}
                                        {roles.map((role) => (
                                          <option key={role.role_id} value={role.role_id}>
                                            {role.role_name} {/* Display role_name */}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>

                                 {/* Address */}
<div className="mb-4 row align-items-center">
  <label className="form-label-title col-lg-2 col-md-3 mb-0">Address</label>
  <div className="col-md-9 col-lg-10">
    <input
      className="form-control"
      type="text"
      name="address"
      placeholder="Enter address"
      value={formData.address}
      onChange={handleChange}
      required
    />
    {formData.address === "" && (
      <small className="text-danger">Address is required.</small>
    )}
  </div>
</div>

{/* Pincode */}
<div className="mb-4 row align-items-center">
  <label className="form-label-title col-lg-2 col-md-3 mb-0">Pincode</label>
  <div className="col-md-9 col-lg-10">
    <input
      className="form-control"
      type="text"
      name="pincode"
      placeholder="Enter pincode"
      value={formData.pincode}
      onChange={handleChange}
      onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')} // Restrict to numbers only
      pattern="^[0-9]{6}$"
      maxLength="6"
      required
    />
    {!/^[0-9]{6}$/.test(formData.pincode) && formData.pincode && (
      <small className="text-danger">Pincode must be a 6-digit number.</small>
    )}
  </div>
</div>

{/* Phone */}
<div className="mb-4 row align-items-center">
  <label className="form-label-title col-lg-2 col-md-3 mb-0">Phone</label>
  <div className="col-md-9 col-lg-10">
    <input
      className="form-control"
      type="tel"
      name="phone"
      placeholder="Enter phone number"
      value={formData.phone}
      onChange={handleChange}
      onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')} // Restrict to numbers only
      pattern="^[0-9]{10}$"
      maxLength="10"
      required
    />
    {!/^[0-9]{10}$/.test(formData.phone) && formData.phone && (
      <small className="text-danger">Phone number must be 10 digits.</small>
    )}
  </div>
</div>


{/* Country */}
<div className="mb-4 row align-items-center">
  <label className="form-label-title col-lg-2 col-md-3 mb-0">Country</label>
  <div className="col-md-9 col-lg-10">
    <input
      className="form-control"
      type="text"
      name="country"
      placeholder="Enter country"
      value={formData.country}
      onChange={handleChange}
      required
    />
    {formData.country === "" && (
      <small className="text-danger">Country is required.</small>
    )}
  </div>
</div>

{/* State */}
<div className="mb-4 row align-items-center">
  <label className="form-label-title col-lg-2 col-md-3 mb-0">State</label>
  <div className="col-md-9 col-lg-10">
    <input
      className="form-control"
      type="text"
      name="state"
      placeholder="Enter state"
      value={formData.state}
      onChange={handleChange}
      required
    />
    {formData.state === "" && (
      <small className="text-danger">State is required.</small>
    )}
  </div>
</div>

                                </div>
                                <div className="row justify-content-center mt-4">
                                  <div className="col-auto">
                                    <button type="submit" className="btn btn-primary btn-lg">
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
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </div>
      <ToastContainer />
      {/* page-wrapper End */}
    </div>
  );
};

export default AddUser;
