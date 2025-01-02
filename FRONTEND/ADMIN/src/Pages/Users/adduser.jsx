import React, { useState, useEffect } from 'react';
import 'remixicon/fonts/remixicon.css';
import {  useNavigate } from 'react-router-dom'; // Import useNavigate

import Sidebar from '../../Components/Sidebar/Sidebar';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/footer';
import axios from 'axios';
import { ToastContainer, toast } from 'react-custom-alert';
import 'react-custom-alert/dist/index.css';

const AddUser = ({ handleLogout, adminData }) => {
  const navigate = useNavigate(); // Initialize useNavigate
  const token = sessionStorage.getItem("authToken"); // Retrieve token from sessionStorage
  
  const [formData, setFormData] = useState({
    username: '',
    email_id: '',
    password: '',
    user_type: '',  // User Type (Role)
    role_id: '',    // Role ID
    address: '',
    pincode: '',
    phone: '',      // Phone Number
    country: '',    // Country
    state: '',      // State
    created_by: adminData.admin_name,
  });

  const [roles, setRoles] = useState([]); // State to store roles data
  const [, setLoading] = useState(true); // State to manage loading

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

    // If the user selects a role, update both role_name and role_id
    if (name === "user_type") {
      const selectedRole = roles.find(role => role.role_name === value);
      setFormData({
        ...formData,
        user_type: value,
        role_id: selectedRole ? selectedRole.role_id : ''
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Basic Validation: Check if any field is empty
    const { username, email_id, password, user_type, phone, country, state, address, pincode, role_id } = formData;
  
    if (!username || !email_id || !password || !user_type || !phone || !country || !state || !address || !pincode || !role_id) {
      toast.error('All fields are required!');
      return;
    }
  
    try {
      // Add token in the Authorization header
      const response = await axios.post('/admin/adduser', formData, {
        headers: {
          'Authorization': `Bearer ${token}` // Passing token in header
        }
      });
  
      // Check if response status is 200 (OK) to show success or failure message
      if (response.status === 200) {
        toast.success(response.data.message || 'User added successfully');
        setTimeout(() => {
          navigate('/allusers'); // Navigate to /allusers after 2 seconds
        }, 2000);
      } else {
        toast.error(response.data.message || 'Failed to add user');
      }
    } catch (error) {
      console.error('Error adding user:', error);
  
      // Handle error based on status code or fallback message
      const errorMessage = error.response?.data?.message || 'Failed to add user';
      toast.error(errorMessage);
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
                                        required
                                        maxLength="15"
                                        pattern="^[a-zA-Z0-9]+$"
                                        title="Username must be alphanumeric and up to 15 characters long"
                                      />
                                    </div>
                                  </div>

                                  {/* Email */}
                                  <div className="mb-4 row align-items-center">
                                    <label className="col-lg-2 col-md-3 col-form-label form-label-title">Email Address</label>
                                    <div className="col-md-9 col-lg-10">
                                      <input
                                        className="form-control"
                                        type="email"
                                        name="email_id" 
                                        placeholder="Enter email address"
                                        value={formData.email_id}
                                        onChange={handleChange}
                                        required
                                        pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                                        title="Enter a valid email address"
                                      />
                                    </div>
                                  </div>

                                  {/* Password */}
                                  <div className="mb-4 row align-items-center">
                                    <label className="col-lg-2 col-md-3 col-form-label form-label-title">Password</label>
                                    <div className="col-md-9 col-lg-10">
                                      <input
                                        className="form-control"
                                        type="password"
                                        name="password"
                                        placeholder="Enter password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        minLength="6"
                                        pattern="^[A-Za-z\d@$!%*?&]{6,}$"
                                        title="Password must be at least 6 characters long and contain only letters, digits, and special characters (no other characters allowed)"
                                      />
                                    </div>
                                  </div>

                                  {/* User Type (Role) */}
                                  <div className="mb-4 row align-items-center">
                                    <label className="form-label-title col-lg-2 col-md-3 mb-0">User Type</label>
                                    <div className="col-md-9 col-lg-10">
                                      <select
                                        className="form-control"
                                        name="user_type"
                                        value={formData.user_type}
                                        onChange={handleChange}
                                        required
                                      >
                                        <option value="">Select UserType</option>
                                        {roles.map((role) => (
                                          <option key={role.role_id} value={role.role_name}>
                                            {role.role_name}
                                          </option>
                                        ))}
                                      </select>
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

<div className="row justify-content-center mt-4">
                                  <div className="col-auto">
                                    <button type="submit" className="btn btn-primary btn-lg">
                                      Submit
                                    </button>
                                  </div>
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
          </div>

          {/* Page Footer */}
          <Footer />
        </div>
      </div>
          <ToastContainer />
    </div>
  );
};

export default AddUser;





