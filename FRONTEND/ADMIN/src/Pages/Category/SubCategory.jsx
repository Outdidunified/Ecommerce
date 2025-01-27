import React, { useState, useEffect } from "react";
import "remixicon/fonts/remixicon.css";
import { Link } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/footer";
import { ToastContainer, toast } from "react-custom-alert";
import "react-custom-alert/dist/index.css";

const SubCategory = ({ handleLogout, adminData }) => {
  const [categories, setCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [categoryToEdit, setCategoryToEdit] = useState({});
  const [categoryToView, setCategoryToView] = useState({}); // For category details modal
  const [showCategoryModal, setShowCategoryModal] = useState(false); // For toggling the edit modal visibility
  const [showCategoryDetailsModal, setShowCategoryDetailsModal] =
    useState(false); // For toggling the view details modal visibility
    

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/categories/getAllSubCategories");
        if (response.status === 200) {
          setCategories(response.data.subcategories); // Use `subcategories` from the response
        } else {
          throw new Error("Failed to fetch categories");
        }
      } catch (err) {
        setErrorMessage(
          err.response?.data?.message || "Failed to fetch categories"
        );
      }
    };

    fetchCategories();
  }, []);

  const formatDateToIST = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const handleEditClick = (subcategory) => {
    setCategoryToEdit({
      sub_category_id: subcategory.sub_category_id,
      sub_category_name: subcategory.sub_category_name,
      main_category_id: subcategory.main_category_id, // Add the main_category_id here
      main_category_name: subcategory.main_category_name,
      created_by: subcategory.created_by,
      created_date: subcategory.created_date,
      status: subcategory.status,
    });
    setShowCategoryModal(true); // Show the Edit Modal
  };

  async function handleDeleteSubcategory(subcategoryId, currentStatus) {
  try {
    const newStatus = currentStatus === 1 ? 0 : 1;

    const requestBody = {
      sub_category_id: subcategoryId,
      status: newStatus,
      modified_by: "sujata", // Replace with dynamic value if needed
    };

    const response = await axios.post("/categories/deletesubcategory", requestBody);

    if (response.status === 200) {
      toast.success(
        newStatus === 1
          ? "Subcategory activated successfully!"
          : "Subcategory deactivated successfully!"
      );

      // Update categories state
      setCategories((prevCategories) =>
        prevCategories.map((subcategory) =>
          subcategory.sub_category_id === subcategoryId
            ? { ...subcategory, status: newStatus }
            : subcategory
        )
      );
    } else {
      toast.error("Failed to update subcategory");
    }
  } catch (error) {
    console.error("Error updating subcategory:", error);
    toast.error("An error occurred while updating the subcategory");
  }
}

  
  
  
  
  const handleCategoryUpdate = async (e) => {
    e.preventDefault();

    // Construct the updated subcategory data
    const updatedSubCategory = {
      sub_category_id: categoryToEdit.sub_category_id,
      main_category_id: categoryToEdit.main_category_id, // Pass the main_category_id here
      sub_category_name: categoryToEdit.sub_category_name?.toLowerCase() || "",
      modified_by: adminData.admin_name,
    };

    try {
      const response = await axios.put(
        "/categories/updatesubcategory",
        updatedSubCategory
      );

      if (response.status === 200) {
        toast.success(
          `Subcategory ID ${categoryToEdit.sub_category_id} updated successfully!`
        );

        // Update the categories state correctly
        setCategories((prevCategories) =>
          prevCategories.map((subcategory) => {
            if (
              subcategory.sub_category_id === categoryToEdit.sub_category_id
            ) {
              return {
                ...subcategory,
                sub_category_name: categoryToEdit.sub_category_name,
                status: categoryToEdit.status, // Ensure status is updated as well
                main_category_id: categoryToEdit.main_category_id, // Update main_category_id too
              };
            }
            return subcategory;
          })
        );
        setShowCategoryModal(false); // Close modal on successful update
      } else {
        throw new Error("Failed to update subcategory");
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "Failed to update subcategory"
      );
      toast.error(
        err.response?.data?.message || "Failed to update subcategory"
      );
    }
  };

  const closeCategoryModal = () => {
    setShowCategoryModal(false); // Close the modal
    setCategoryToEdit({}); // Reset the form data
  };

  const openCategoryDetailsModal = (category) => {
    setCategoryToView(category); // Set the category to be viewed
    setShowCategoryDetailsModal(true); // Open the details modal
  };

  // Function to close the category details modal
  const closeCategoryDetailsModal = () => {
    setShowCategoryDetailsModal(false); // Close the modal
    setCategoryToView({}); // Reset the form data
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
                        <h5>Main Categories</h5>
                        <form className="d-inline-flex">
                          <Link className="btn btn-solid" to="/Addcategory">
                            Add New
                          </Link>
                        </form>
                      </div>

                      <div className="table-responsive category-table">
                        <table
                          className="table all-package theme-table"
                          id="table_id"
                        >
                          <thead>
                            <tr>
                              <th>Sub Category Id</th>
                              <th>Sub Category Name</th>
                              <th>Main Category Name</th>
                              <th>Created By</th>
                              <th>Created Date</th>
                              <th>Status</th>
                              <th>Option</th>
                            </tr>
                          </thead>
                          <tbody>
                            {categories.length > 0 ? (
                              categories.map((subcategory) => (
                                <tr key={subcategory.category_id}>
                                  <td>{subcategory.sub_category_id}</td>
                                  <td>
                                    {subcategory.sub_category_name || "N/A"}
                                  </td>
                                  <td>
                                    {subcategory.main_category_name || "N/A"}
                                  </td>
                                  <td>{subcategory.created_by}</td>
                                  <td>
                                    {formatDateToIST(subcategory.created_date)}
                                  </td>
                                  <td>
  <span
    style={{
      color: subcategory.status === 1 ? "green" : "red",
    }}
  >
    {subcategory.status === 1 ? "Active" : "Deactive"}
  </span>
</td>

                                  <td>
                                    <ul>
                                      <li>
                                        <button
                                          onClick={() =>
                                            openCategoryDetailsModal(
                                              subcategory
                                            )
                                          } // Open the details modal on click
                                          className="btn btn-link p-0"
                                          aria-label="View subcategory"
                                          style={{ textDecoration: "none" }}
                                        >
                                          <i className="ri-eye-line"></i>
                                        </button>
                                      </li>
                                      <li>
                                        <button
                                          onClick={() =>
                                            handleEditClick(subcategory)
                                          }
                                          className="btn btn-link p-0"
                                          aria-label="Edit subcategory"
                                          style={{ textDecoration: "none" }}
                                        >
                                          <i
                                            className="ri-pencil-line"
                                            style={{
                                              color: "blue",
                                              textDecoration: "none",
                                            }}
                                          ></i>
                                        </button>
                                      </li>
                                      <button
                                        onClick={() =>
                                          handleDeleteSubcategory(
                                            subcategory.sub_category_id,
                                            subcategory.status
                                          )
                                        }
                                        className="btn btn-link p-0"
                                        aria-label="Delete subcategory"
                                        style={{ textDecoration: "none" }}
                                      >
                                        <i
                                          className={
                                            subcategory.status === 1
                                              ? "ri-delete-bin-line"
                                              : "ri-add-line"
                                          }
                                          style={{
                                            color: subcategory.status === 1 ? "red" : "green",
                                          }}
                                        ></i>
                                      </button>

                                    </ul>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="7" className="text-center">
                                  {errorMessage || "No subcategories available"}
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

            <div className="container-fluid">
              <Footer />
            </div>
          </div>
        </div>
      </div>

      {showCategoryDetailsModal && categoryToView && (
        <div
          className="modal"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Subcategory Details</h5>
                <button
                  onClick={closeCategoryDetailsModal}
                  className="close"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Subcategory Id:</strong>{" "}
                  {categoryToView.sub_category_id}
                </p>
                <p>
                  <strong>Subcategory Name:</strong>{" "}
                  {categoryToView.sub_category_name}
                </p>
                <p>
                  <strong>Main Category Name:</strong>{" "}
                  {categoryToView.main_category_name}
                </p>
                <p>
                  <strong>Created By:</strong> {categoryToView.created_by}
                </p>
                <p>
                  <strong>Created Date:</strong>{" "}
                  {formatDateToIST(categoryToView.created_date)}
                </p>
                <p>
                  <strong>Modified By:</strong>{" "}
                  {categoryToView.modified_by || "N/A"}
                </p>
                <p>
                  <strong>Modified Date:</strong>{" "}
                  {categoryToView.modified_date
                    ? formatDateToIST(categoryToView.modified_date)
                    : "N/A"}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {categoryToView.status === 1 ? "Active" : "Inactive"}
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeCategoryDetailsModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCategoryModal && categoryToEdit && (
        <div
          className="modal"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Subcategory</h5>
                <button
                  onClick={closeCategoryModal}
                  className="close"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleCategoryUpdate}>
                  <div className="form-group">
                    <label>Subcategory Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={categoryToEdit.sub_category_name || ""}
                      onChange={(e) =>
                        setCategoryToEdit({
                          ...categoryToEdit,
                          sub_category_name: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="modal-footer">
                    <button type="submit" className="btn btn-primary">
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={closeCategoryModal}
                    >
                      Close
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default SubCategory;
