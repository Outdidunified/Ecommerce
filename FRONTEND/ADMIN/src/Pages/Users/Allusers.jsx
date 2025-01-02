import React, { useEffect, useState } from "react";
import axios from "axios";
import "remixicon/fonts/remixicon.css";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-custom-alert';
import 'react-custom-alert/dist/index.css';
import Sidebar from "../../Components/Sidebar/Sidebar";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/footer";

const Allusers = ({ handleLogout, adminData }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem("authToken"); // Retrieve token from sessionStorage
  const [showUserViewModal, setShowUserViewModal] = useState(false);
  const [userToView, setUserToView] = useState(null);
  const [showUserEditModal, setshowUserEditModal] = useState(false);
const [userToEdit, setuserToEdit] = useState(null);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/admin/getalluser", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data.users);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const toggleUserStatus = async (user) => {
    try {
      const response = await axios.post(
        "/admin/deleteuser",
        {
          user_id: user.user_id,
          active: user.active ? 0 : 1, // Toggle active status
          modified_by: adminData.admin_name ,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("User status updated successfully!");
        // Update the user status and icon
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.user_id === user.user_id
              ? { ...u, active: !user.active } // Toggle active status
              : u
          )
        );
      } else {
        toast.error("Failed to update user status!");
      }
    } catch (error) {
      console.error("Error toggling user status:", error);
      toast.error("An error occurred while updating user status.");
    }
  };

  const openUserViewModal = (user) => {
    setUserToView(user);
    setShowUserViewModal(true);
  };

  const closeUserViewModal = () => {
    setShowUserViewModal(false);
    setUserToView(null);
  };

  const openuserEditModal = (user) => {
    setuserToEdit(user); // Set the user to be edited
    setshowUserEditModal(true); // Open the modal
  };
  
  const closeUserEditModal = () => {
    setshowUserEditModal(false); // Close the modal
    setuserToEdit(null); // Clear the user data
  };

  const handleUserUpdate = async (e) => {
    e.preventDefault(); // Prevent default form submission
  
    // Ensure userToEdit has the necessary fields for the API request
    const updatedUserData = {
      user_id: userToEdit.user_id,
      username: userToEdit.username,
      email_id: userToEdit.email_id,
      password: userToEdit.password,
      role_id: userToEdit.role_id,
      user_type: userToEdit.user_type,
      address: userToEdit.address,
      pincode: userToEdit.pincode,
      phone: userToEdit.phone,
      country: userToEdit.country,
      state: userToEdit.state,
      modified_by: adminData.admin_name, // Ensure this value is being set properly
    };
  
    try {
      const response = await axios.put(
        '/admin/updateuser', 
        updatedUserData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.status === 200) {
        toast.success("User updated successfully!");
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.user_id === userToEdit.user_id ? userToEdit : user
          )
        );
        closeUserEditModal();
      } else {
        toast.error("Failed to update user.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("An error occurred while updating the user.");
    }
  };
  
  
  

  return (
    <div>
      {/* Page Wrapper Start */}
      <div className="page-wrapper compact-wrapper" id="pageWrapper">
        <Header handleLogout={handleLogout} adminData={adminData} />
        <div className="page-body-wrapper">
          <Sidebar />
          <div className="page-body">
            <div className="container-fluid">
              <div className="row">
                <div className="col-sm-12">
                  <div className="card card-table">
                    <div className="card-body">
                      <div className="title-header option-title">
                        <h5>All Users</h5>
                        <form className="d-inline-flex">
                        <Link to="/adduser" className="align-items-center btn btn-theme d-flex">
    <i data-feather="plus"></i>Add New
  </Link>
                        </form>
                      </div>

                      <div className="table-responsive category-table">
                        <table className="table all-package theme-table" id="table_id">
                          <thead>
                            <tr>
                              <th>User ID</th>
                              <th>Username</th>
                              <th>Email ID</th>
                              <th>User Type</th>
                              <th>Phone</th>
                              <th>Created By</th>
                              <th>User status</th>
                              <th>Option</th>
                            </tr>
                          </thead>
                          <tbody>
                            {loading ? (
                              <tr>
                                <td colSpan="7" className="text-center">
                                  Loading...
                                </td>
                              </tr>
                            ) : users.length > 0 ? (
                              users.map((user) => (
                                <tr key={user.user_id}>
                                  <td>{user.user_id}</td>
                                  <td>{user.username}</td>
                                  <td>{user.email_id}</td>
                                  <td>{user.user_type}</td>
                                  <td>{user.phone}</td>
                                  <td>{user.created_by}</td>
                                  <td
                                    style={{
                                      color: user.active ? "green" : "red", // Green for Active, Red for Inactive
                                    }}
                                  >
                                    {user.active ? "Active" : "Inactive"}
                                  </td>
                                  <td>
                                  <ul>
  <li>
    <button
      onClick={() => openUserViewModal(user)}
      className="btn btn-link"
      aria-label="View user"
      style={{
        textDecoration: "none",
        color: "#000000", // Black color for the View button
        fontSize: "20px", // Increased font size
        padding: "10px", // Increased padding for larger button area
      }}
    >
      <i className="ri-eye-line"></i> {/* Eye Icon for View */}
    </button>
  </li>

  <td>
    <ul>
      <li>
        <button
          onClick={() => openuserEditModal(user)}
          className="btn btn-link"
          aria-label="Edit user"
          style={{
            textDecoration: "none",
            color: "#007bff", // Blue color for Edit button
            fontSize: "20px", // Increased font size
            padding: "10px",
          }}
        >
          <i className="ri-pencil-line"></i> {/* Pen Icon for Edit */}
        </button>
      </li>
    </ul>
  </td>

  <li>
    <button
      onClick={() => toggleUserStatus(user)}
      className="btn btn-link"
      aria-label="Activate/Deactivate user"
      style={{
        textDecoration: "none",
        color: user.active ? "red" : "green", // Red if Active, Green if Inactive
        fontSize: "20px", // Increased font size
        padding: "10px",
      }}
    >
      <i
        className={
          user.active
            ? "ri-delete-bin-line" // Bin icon for delete (Active)
            : "ri-add-line" // Add icon for add (Inactive)
        }
      ></i>
    </button>
  </li>
</ul>


                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="7" className="text-center">
                                  No users found.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
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

      {/* Modal for Viewing User */}
      {showUserViewModal && userToView && (
        <div
          className="modal"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">View User</h5>
                <button onClick={closeUserViewModal} className="close" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div>
                    <strong>User ID:</strong> {userToView.user_id}
                  </div>
                  <div>
                    <strong>Username:</strong> {userToView.username}
                  </div>
                  <div>
                    <strong>Email ID:</strong> {userToView.email_id}
                  </div>
                  <div>
                    <strong>Password:</strong> {userToView.password}
                  </div>
                  <div>
                    <strong>Role ID:</strong> {userToView.role_id}
                  </div>
                  <div>
                    <strong>Address:</strong> {userToView.address || "N/A"}
                  </div>
                  <div>
                    <strong>Pincode:</strong> {userToView.pincode || "N/A"}
                  </div>
                  <div>
                    <strong>Phone:</strong> {userToView.phone || "N/A"}
                  </div>
                  <div>
                    <strong>Country:</strong> {userToView.country || "N/A"}
                  </div>
                  <div>
                    <strong>State:</strong> {userToView.state || "N/A"}
                  </div>
                  <div>
                    <strong>Created By:</strong> {userToView.created_by || "N/A"}
                  </div>
                  <div>
                    <strong>Created Date:</strong>{" "}
                    {new Date(userToView.created_date).toLocaleString()}
                  </div>
                  <div>
                    <strong>Modified By:</strong> {userToView.modified_by}
                  </div>
                  <div>
                    <strong>Modified Date:</strong>{" "}
                    {new Date(userToView.modified_date).toLocaleString()}
                  </div>
                  <div>
                    <strong>User Type:</strong> {userToView.user_type}
                  </div>
                  <div>
                    <strong>Active:</strong> {userToView.active ? "Yes" : "No"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

 {/* Modal for Editing user */}
{showUserEditModal && userToEdit && (
  <div
    className="modal"
    style={{
      display: "block",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    }}
  >
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Edit User</h5>
          <button onClick={closeUserEditModal} className="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <form onSubmit={handleUserUpdate}>
          <div className="modal-body">
            {/* Username Field */}
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                className="form-control"
                value={userToEdit.username || ""}
                onChange={(e) => {
                  const input = e.target.value;
                  if (/^[A-Za-z0-9]*$/.test(input) && input.length <= 15) {
                    setuserToEdit({ ...userToEdit, username: input });
                  }
                }}
                placeholder="Enter Username"
                maxLength={15}
              />
              {userToEdit.username && !/^[A-Za-z0-9]*$/.test(userToEdit.username) && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  Please enter only alphanumeric characters.
                </span>
              )}
              {userToEdit.username?.length === 15 && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  Maximum length of 15 characters reached.
                </span>
              )}
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                value={userToEdit.email_id || ""}
                disabled
                onChange={(e) =>
                  setuserToEdit({ ...userToEdit, email_id: e.target.value })
                }
              />
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label>Password</label>
              <input
                type="text"
                className="form-control"
                value={userToEdit.password || ""}
                onChange={(e) =>
                  setuserToEdit({ ...userToEdit, password: e.target.value })
                }
              />
            </div>

            {/* Address Field */}
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                className="form-control"
                value={userToEdit.address || ""}
                onChange={(e) => {
                  const input = e.target.value;
                  if (/^[A-Za-z0-9\s,./]*$/.test(input) && input.length <= 100) {
                    setuserToEdit({ ...userToEdit, address: input });
                  }
                }}
                placeholder="Enter Address"
                maxLength={100}
              />
              {userToEdit.address && !/^[A-Za-z0-9\s,./]*$/.test(userToEdit.address) && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  Please enter only alphanumeric characters, spaces, commas, periods, or slashes.
                </span>
              )}
              {userToEdit.address?.length === 100 && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  Maximum length of 100 characters reached.
                </span>
              )}
            </div>

            {/* Pincode Field */}
            <div className="form-group">
              <label>Pincode</label>
              <input
                type="text"
                className="form-control"
                value={userToEdit.pincode || ""}
                onChange={(e) => {
                  const input = e.target.value;
                  if (/^\d{0,6}$/.test(input)) {
                    setuserToEdit({ ...userToEdit, pincode: input });
                  }
                }}
                placeholder="Enter Pincode"
              />
              {userToEdit.pincode && !/^\d*$/.test(userToEdit.pincode) && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  Please enter only numbers.
                </span>
              )}
              {userToEdit.pincode?.length > 6 && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  You cannot enter more than 6 digits.
                </span>
              )}
            </div>

            {/* Phone Field */}
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                className="form-control"
                value={userToEdit.phone || ""}
                onChange={(e) => {
                  const input = e.target.value;
                  if (/^\d{0,10}$/.test(input)) {
                    setuserToEdit({ ...userToEdit, phone: input });
                  }
                }}
                placeholder="Enter Phone Number"
              />
              {userToEdit.phone && !/^\d*$/.test(userToEdit.phone) && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  Please enter only numbers.
                </span>
              )}
              {userToEdit.phone?.length > 10 && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  You cannot enter more than 10 digits.
                </span>
              )}
            </div>

            {/* Country Field */}
            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                className="form-control"
                value={userToEdit.country || ""}
                onChange={(e) => {
                  const input = e.target.value;
                  if (/^[A-Za-z\s]*$/.test(input)) {
                    setuserToEdit({ ...userToEdit, country: input });
                  }
                }}
                placeholder="Enter Country"
              />
              {userToEdit.country && !/^[A-Za-z\s]*$/.test(userToEdit.country) && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  Please enter only alphabetic characters and spaces.
                </span>
              )}
            </div>

            {/* State Field */}
            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                className="form-control"
                value={userToEdit.state || ""}
                onChange={(e) => {
                  const input = e.target.value;
                  if (/^[A-Za-z\s]*$/.test(input)) {
                    setuserToEdit({ ...userToEdit, state: input });
                  }
                }}
                placeholder="Enter State"
              />
              {userToEdit.state && !/^[A-Za-z\s]*$/.test(userToEdit.state) && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  Please enter only alphabetic characters and spaces.
                </span>
              )}
            </div>

            {/* Active Status Field */}
            <div className="mb-4 row align-items-center">
              <label className="col-sm-3 col-form-label form-label-title">Active</label>
              <div className="col-sm-9 mt-3">
                <select
                  className="form-control"
                  value={userToEdit.active === 1 ? "Yes" : "No"}
                  onChange={(e) =>
                    setuserToEdit({
                      ...userToEdit,
                      active: e.target.value === "Yes" ? 1 : 0,
                    })
                  }
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>

          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeUserEditModal}>
              Close
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}





      {/* Toast Container for notifications */}
      <ToastContainer />
    </div>
  );
};

export default Allusers;
