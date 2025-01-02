import React, { useState, useEffect } from "react";
import "remixicon/fonts/remixicon.css";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/footer";
import axios from "axios"; // To make API requests
import { ToastContainer, toast } from "react-custom-alert"; // Importing react-custom-alert
import "react-custom-alert/dist/index.css"; // import css file from root.

const Allrole = ({ handleLogout, adminData }) => {
  const [roles, setRoles] = useState([]); // State to store role data
  const [loading, setLoading] = useState(true); // Loading state
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [showEditModal, setShowEditModal] = useState(false); // Edit modal visibility state
  const [roleName, setRoleName] = useState(""); // Role name input state
  const [roleToEdit, setRoleToEdit] = useState(null); // Role to edit state
  const [updatedRoleName, setUpdatedRoleName] = useState(""); // Updated role name input state


  useEffect(() => {
    // Fetch roles from the API on component mount
    axios
      .get("/roles")
      .then((response) => {
        setRoles(response.data); // Set the role data to state
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
        setLoading(false);
      });
  }, []);

  const handleAddRole = () => {
    if (roleName) {
      // Send the new role data to your backend
      axios
        .post("/roles/add", {
          role_name: roleName.toLowerCase(),
          created_by: adminData.admin_name,
        })
        .then((response) => {
          toast.success("Role added successfully!"); // Success toast
          // Re-fetch roles after adding a new one to ensure the list is updated
          axios
            .get("/roles")
            .then((response) => {
              setRoles(response.data); // Update the state with the latest roles
            })
            .catch((error) => {
              console.error(error);
              toast.error("Failed to fetch updated roles."); // Error toast
            });
          setRoleName(""); // Reset input field
          setShowModal(false); // Close the modal
        })
        .catch((error) => {
          console.error("Error adding role:", error);
          toast.error("Failed to add role. Please try again."); // Error toast
        });
    } else {
      toast.error("Please enter a role name");
    }
  };

  const handleEditClick = (role) => {
    setRoleToEdit(role); // Set the role to edit
    setUpdatedRoleName(role.role_name); // Pre-fill the updated role name
    setShowEditModal(true); // Open the edit modal
  };

  const handleUpdateRole = () => {
    if (updatedRoleName && roleToEdit) {
      // Send the updated role data to the backend
      axios
        .post("/roles/update", {
          role_id: roleToEdit.role_id,
          role_name: updatedRoleName.toLowerCase(),
          modified_by: adminData.admin_name,
        })
        .then((response) => {
          if (response.status === 200) {
            toast.success("Role updated successfully!"); // Success toast
            // Re-fetch roles after updating the role to ensure the list is updated
            axios
              .get("/roles")
              .then((res) => {
                setRoles(res.data); // Update the state with the latest roles
              })
              .catch((err) => {
                console.error("Error fetching roles after updating:", err);
                toast.error(
                  "Failed to fetch updated roles list. Please refresh."
                );
              });
            setShowEditModal(false); // Close the edit modal
          } else {
            toast.error("Failed to update role. Please try again."); // Error toast for unexpected status
          }
        })
        .catch((error) => {
          console.error("Error updating role:", error);
          toast.error(
            "An error occurred while updating the role. Please try again."
          );
        });
    } else {
      toast.warning("Please enter a role name"); // Warning toast for empty input
    }
  };

  const handleToggleRoleStatus = (role) => {
    const statusToUpdate = role.status === 1 ? 0 : 1; // Toggle between active (1) and inactive (0)
    const modified_by = adminData.admin_name;

    // Send the request to update the status
    axios
      .post("/roles/delete", {
        role_id: role.role_id,
        status: statusToUpdate,
        modified_by,
      })
      .then((response) => {
        toast.success("Role status updated successfully!"); // Show success toast

        // Update the roles list after the status change
        setRoles(
          roles.map((r) =>
            r.role_id === role.role_id
              ? { ...r, status: statusToUpdate, modified_by: modified_by }
              : r
          )
        );
      })
      .catch((error) => {
        console.error("Error updating role status:", error);
        toast.error("Failed to update role status");
      });
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
                <div className="col-sm-12">
                  <div className="card card-table">
                    <div className="card-body">
                      <div className="title-header option-title">
                        <h5>Role List</h5>
                        <form className="d-inline-flex">
                          <button
                            type="button"
                            className="align-items-center btn btn-theme d-flex"
                            onClick={() => setShowModal(true)}
                          >
                            <i data-feather="plus"></i>Add Role
                          </button>
                        </form>
                      </div>
                      <div>
                        <div className="table-responsive">
                          <table
                            id="table_id"
                            className="table role-table all-package theme-table"
                          >
                            <thead>
                              <tr>
                                <th>Role id</th>
                                <th>Name</th>
                                <th>Create At</th>
                                <th>Create By</th>
                                <th>Modified At</th>
                                <th>Modified By</th>
                                <th>Status</th>
                                <th>Options</th>
                              </tr>
                            </thead>

                            <tbody>
                              {loading ? (
                                <tr>
                                  <td colSpan="8" className="text-center">
                                    Loading...
                                  </td>
                                </tr>
                              ) : (
                                roles.map((role, index) => (
                                  <tr key={role.role_id}>
                                    <td>{index + 1}</td>
                                    <td>{role.role_name}</td>
                                    <td>
                                      {new Date(
                                        role.created_date
                                      ).toLocaleString()}
                                    </td>
                                    <td>{role.created_by}</td>
                                    <td>
                                      {new Date(
                                        role.modified_date
                                      ).toLocaleString()}
                                    </td>
                                    <td>{role.modified_by}</td>
                                    <td
                                      style={{
                                        color:
                                          role.status === 1 ? "green" : "red",
                                      }}
                                    >
                                      {role.status === 1
                                        ? "Active"
                                        : "Deactive"}
                                    </td>

                                    <td>
                                      <ul>
                                        <li>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleEditClick(role)
                                            }
                                            className="btn p-0"
                                            style={{ color: "blue" }} // Applying blue color to the icon
                                          >
                                            <i className="ri-pencil-line"></i>
                                          </button>
                                        </li>
                                        <li>
                                          <button
                                            type="button"
                                            className={`btn text-decoration-none p-0 ${
                                              role.status === 1
                                                ? "text-danger"
                                                : "text-success"
                                            }`}
                                            onClick={() =>
                                              handleToggleRoleStatus(role)
                                            }
                                          >
                                            <i
                                              className={`ri-${
                                                role.status === 1
                                                  ? "delete-bin-line"
                                                  : "add-circle-line"
                                              }`}
                                            ></i>
                                          </button>
                                        </li>
                                      </ul>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Add Role Modal */}
            {showModal && (
              <div
                className="modal fade show"
                id="addRoleModal"
                tabIndex="-1"
                aria-labelledby="addRoleModalLabel"
                aria-hidden="true"
                style={{ display: "block" }}
              >
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="addRoleModalLabel">
                        Add Role
                      </h5>
                      <button
                        type="button"
                        className="close"
                        onClick={() => setShowModal(false)}
                        aria-label="Close"
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <div className="form-group">
                        <label htmlFor="updatedRoleName">Role Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="updatedRoleName"
                          value={roleName}
                          onChange={(e) => {
                            const input = e.target.value;
                            // Allow only alphabetic characters and spaces
                            if (/^[A-Za-z\s]*$/.test(input)) {
                              setRoleName(input);
                            }
                          }}
                          placeholder="Enter  Role Name"
                          maxLength={15} // Sets a maximum length of 15 characters
                        />
                        {/* Optional: Inline message to guide the user */}
                        {roleName.length === 15 && (
                          <span style={{ color: "red", fontSize: "12px" }}>
                            Maximum length of 15 characters reached.
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowModal(false)}
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleAddRole}
                      >
                        Save Role
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Role Modal */}
            {showEditModal && (
              <div
                className="modal fade show"
                id="editRoleModal"
                tabIndex="-1"
                aria-labelledby="editRoleModalLabel"
                aria-hidden="true"
                style={{ display: "block" }}
              >
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="editRoleModalLabel">
                        Edit Role
                      </h5>
                      <button
                        type="button"
                        className="close"
                        onClick={() => setShowEditModal(false)}
                        aria-label="Close"
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <div className="form-group">
                        <label htmlFor="updatedRoleName">Role Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="updatedRoleName"
                          value={updatedRoleName}
                          onChange={(e) => {
                            const input = e.target.value;
                            // Allow only alphabetic characters and spaces
                            if (/^[A-Za-z\s]*$/.test(input)) {
                              setUpdatedRoleName(input);
                            }
                          }}
                          placeholder="Enter Updated Role Name"
                          maxLength={15} // Sets a maximum length of 15 characters
                        />
                        {/* Optional: Inline message to guide the user */}
                        {updatedRoleName.length === 15 && (
                          <span style={{ color: "red", fontSize: "12px" }}>
                            Maximum length of 15 characters reached.
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowEditModal(false)}
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleUpdateRole}
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Footer />
          </div>
        </div>
      </div>
      <ToastContainer />
      {/* Page-wrapper End */}
    </div>
  );
};

export default Allrole;
