import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-custom-alert";
import "react-custom-alert/dist/index.css";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/footer";

const ViewProduct = ({ handleLogout, adminData }) => {
  const [products, setProducts] = useState([]);
  const [, setErrorMessage] = useState("");
  const [showProductViewModal, setShowProductViewModal] = useState(false);
  const [showProductEditModal, setShowProductEditModal] = useState(false);
  const [productToView, setProductToView] = useState(null);
  const [productToEdit, setProductToEdit] = useState(null);
  const [categories, setCategories] = useState([]); // State to store the fetched categories
  const [isCategoriesFetched, setIsCategoriesFetched] = useState(false); // Flag to track if categories are already fetched
  const [subCategories] = useState([]); // To store subcategories
  const [selectedCategory, setSelectedCategory] = useState(""); // To store the
  const [selectedSubCategory, setSelectedSubCategory] = useState(""); // To store selected subcategory

  const [, setIsLoading] = useState(true);
  const fileInputRef = useRef(null); // Create ref for Image 1 file input
  const fileInputRef2 = useRef(null); // Create ref for Image 2 file input

  const handleFileChange = (e, imageField) => {
    const file = e.target.files[0];
    if (file) {
      setProductToEdit({
        ...productToEdit,
        [imageField]: file, // Store the actual File object (not the temporary URL)
      });
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/products");
        if (response.status === 200) {
          setProducts(response.data.products);
        } else {
          throw new Error("Failed to fetch products");
        }
      } catch (err) {
        setErrorMessage(
          err.response?.data?.message || "Failed to fetch products"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const openProductViewModal = (product) => {
    setProductToView(product);
    setShowProductViewModal(true);
  };

  const closeProductViewModal = () => {
    setShowProductViewModal(false);
    setProductToView(null);
  };

  const openProductEditModal = (product) => {
    setProductToEdit(product);
    setSelectedCategory(product.category_name); // Set the selected category
    setSelectedSubCategory(product.sub_category_name); // Set the selected subcategory
    setShowProductEditModal(true);
  };

  const closeProductEditModal = () => {
    setShowProductEditModal(false);
    setProductToEdit(null);
  };

  useEffect(() => {
    if (!isCategoriesFetched) {
      axios
        .get("/categories/categoryname")
        .then((response) => {
          if (Array.isArray(response.data.categories)) {
            setCategories(response.data.categories);
            setIsCategoriesFetched(true);
          } else {
            console.error("Categories response is not an array");
          }
        })
        .catch((error) => {
          console.error("Error fetching categories:", error);
        });
    }
  }, [isCategoriesFetched]);

  const handleProductUpdate = async (e) => {
    e.preventDefault();

    if (productToEdit) {
      try {
        // Find the category ID for the selected category
        const selectedCategoryObj = categories.find(
          (category) => category.category_name === selectedCategory
        );
        const selectedSubCategoryObj = subCategories.find(
          (subcategory) => subcategory.sub_category_name === selectedSubCategory
        );

        // Create FormData object to send the data
        const formData = new FormData();

        // Append text data to FormData
        formData.append("product_id", productToEdit.product_id);
        formData.append("product_name", productToEdit.product_name);
        formData.append("price", productToEdit.price);
        formData.append("unit", productToEdit.unit);
        formData.append("quantity", productToEdit.quantity);
        formData.append("exchangable", productToEdit.exchangable);
        formData.append("refundable", productToEdit.refundable);
        formData.append("modified_by", adminData.admin_name);
        formData.append("role_id", adminData.role);
        formData.append(
          "category_id",
          selectedCategoryObj ? selectedCategoryObj.category_id : ""
        );
        formData.append("category_name", selectedCategory);
        formData.append(
          "sub_category_id",
          selectedSubCategoryObj ? selectedSubCategoryObj.sub_category_id : ""
        );
        formData.append("sub_category_name", selectedSubCategory);
        formData.append("description", productToEdit.description);

        // Append files (actual image files, not URLs)
        if (productToEdit.image) {
          formData.append("image", productToEdit.image); // Append the actual image file (not a URL)
        }
        if (productToEdit.image2) {
          formData.append("image2", productToEdit.image2); // Append the second image file (not a URL)
        }

        // Send the request to the API
        const response = await axios.put("/products/update", formData, {
          headers: {
            "Content-Type": "multipart/form-data", // Ensure the request is handled as multipart form data
          },
        });

        if (response.status === 200) {
          // Update the products state with the updated product details
          setProducts((prevProducts) =>
            prevProducts.map((product) =>
              product.product_id === productToEdit.product_id
                ? {
                    ...product,
                    ...productToEdit,
                    category_name: selectedCategory,
                    sub_category_name: selectedSubCategory,
                    image: productToEdit.image, // Update the image field with the new image
                    image2: productToEdit.image2, // Update the second image field with the new image2
                  }
                : product
            )
          );

          // Also update the productToEdit state to reflect the updated images
          setProductToEdit((prevProduct) => ({
            ...prevProduct,
            image: productToEdit.image, // Update image in the editing state
            image2: productToEdit.image2, // Update image2 in the editing state
          }));

          toast.success("Product updated successfully!");
          closeProductEditModal();
        } else {
          throw new Error("Failed to update product");
        }
      } catch (err) {
        setErrorMessage(
          err.response?.data?.message || "Failed to update product"
        );
        toast.error("Error updating product. Please try again.");
      }
    }
  };

  const handleDelete = async (product) => {
    console.log(product); // Log product details for debugging

    // Determine new status: toggle between 1 (available) and 0 (deleted)
    const newStatus = product.status === 1 ? 0 : 1;

    try {
      const response = await axios.post("/products/delete", {
        product_id: product.product_id, // Use product.product_id here
        status: newStatus, // Toggle the status (1 for active, 0 for deleted)
        modified_by: adminData.admin_name, // You can replace this with dynamic data if needed
      });

      if (response.status === 200) {
        // Successfully toggled the product status
        const statusMessage =
          newStatus === 1
            ? "Product restored successfully!"
            : "Product deleted successfully!";
        toast.success(statusMessage);

        // Update the UI by modifying the product status
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p.product_id === product.product_id
              ? { ...p, status: newStatus }
              : p
          )
        );
      } else {
        toast.error("Failed to update product status");
      }
    } catch (err) {
      toast.error("Error updating product status. Please try again.");
    }
  };

  return (
    <div>
      <ToastContainer />
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
                      <div className="title-header option-title d-sm-flex d-block">
                        <h5>Products List</h5>
                        <div className="right-options">
                          <ul>
                            <Link className="btn btn-solid" to="/Addproduct">
                              Add Product
                            </Link>
                          </ul>
                        </div>
                      </div>
                      <div>
                        <div className="table-responsive">
                          <table
                            className="table all-package theme-table table-product"
                            id="table_id"
                          >
                            <thead>
                              <tr>
                                <th>Product Id</th>
                                <th>Product Image</th>
                                <th>Product Name</th>
                                <th>Category</th>
                                <th>Current Qty</th>
                                <th>Price</th>
                                <th>Product Status</th>
                                <th>Option</th>
                              </tr>
                            </thead>
                            <tbody>
                              {products.length > 0 ? (
                                products.map((product) => (
                                  <tr key={product.product_id}>
                                    <td>{product.product_id}</td>
                                    <td>
                                      <img
                                        src={
                                          product.image &&
                                          product.image !== "/uploads/null"
                                            ? product.image
                                            : "/images/placeholder.jpg"
                                        }
                                        alt={
                                          product.product_name ||
                                          "Product image"
                                        }
                                        className="img-fluid"
                                        style={{
                                          maxWidth: "100px",
                                          maxHeight: "100px",
                                          objectFit: "cover",
                                          borderRadius: "5px",
                                        }}
                                      />
                                    </td>
                                    <td>{product.product_name}</td>
                                    <td>
                                      {product.category_name} -{" "}
                                      {product.sub_category_name}
                                    </td>{" "}
                                    {/* Update category fields */}
                                    <td>{product.quantity}</td>
                                    <td className="td-price">
                                      Rs.{product.price}
                                    </td>
                                    <td className="status-close">
                                      <span
                                        style={{
                                          color:
                                            product.status === 1
                                              ? "white"
                                              : "white",
                                          background:
                                            product.status === 1
                                              ? "linear-gradient(90deg, rgba(118, 255, 3, 0.9), rgba(56, 142, 60, 0.9))"
                                              : "linear-gradient(90deg, rgba(255, 138, 128, 0.9), rgba(211, 47, 47, 0.9))",
                                          padding: "5px 10px",
                                          borderRadius: "5px",
                                        }}
                                      >
                                        {product.status === 1
                                          ? "Available"
                                          : "Out of Stock"}
                                      </span>
                                    </td>
                                    <td>
                                      <ul>
                                        <li>
                                          <button
                                            onClick={() =>
                                              openProductViewModal(product)
                                            }
                                            className="btn btn-link"
                                            aria-label="View product"
                                            style={{
                                              textDecoration: "none",
                                              color: "#000000",

                                              fontSize: "20px", // Increased font size
                                              padding: "10px", // Increased padding for larger button area
                                            }}
                                          >
                                            <i className="ri-eye-line"></i>
                                          </button>
                                        </li>
                                        <li>
                                          <button
                                            onClick={() =>
                                              openProductEditModal(product)
                                            }
                                            className="btn btn-link"
                                            aria-label="Edit product"
                                            style={{
                                              textDecoration: "none",
                                              color: "#007bff",
                                              fontSize: "20px", // Increased font size
                                              padding: "10px",
                                            }} // Yellow color for Edit
                                          >
                                            <i className="ri-pencil-line"></i>
                                          </button>
                                        </li>
                                        <li>
                                          <button
                                            onClick={() =>
                                              handleDelete(product)
                                            }
                                            className="btn btn-link"
                                            aria-label="Delete or restore product"
                                            style={{ textDecoration: "none" }} // Remove underline
                                          >
                                            {/* Conditionally render delete or restore icon based on product status */}
                                            {product.status === 0 ? (
                                              <i
                                                className="ri-add-line"
                                                style={{
                                                  color: "green",
                                                  fontSize: "24px",
                                                }}
                                              ></i> // Green color for Restore
                                            ) : (
                                              <i
                                                className="ri-delete-bin-line"
                                                style={{
                                                  color: "red",
                                                  fontSize: "24px",
                                                }}
                                              ></i> // Red color for Delete
                                            )}
                                          </button>
                                        </li>
                                      </ul>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="7">No products found</td>
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
            </div>
            <Footer />
          </div>
        </div>
      </div>
      {/* Modal for Viewing Product */}
      {showProductViewModal && productToView && (
        <div
          className="modal"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  onClick={closeProductViewModal}
                >
                  <span>&times;</span>
                </button>
                <h4 className="modal-title">Product Details</h4>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Product Name: </strong>
                  {productToView.product_name}
                </p>
                <p>
                  <strong>Category: </strong>
                  {productToView.category_name} -{" "}
                  {productToView.sub_category_name}
                </p>
                <p>
                  <strong>Price: </strong>Rs. {productToView.price}
                </p>
                <p>
                  <strong>Unit: </strong>
                  {productToView.unit}
                </p>
                <p>
                  <strong>Quantity: </strong>
                  {productToView.quantity}
                </p>
                <p>
                  <strong>Status: </strong>
                  {productToView.active_status === 1
                    ? "Available"
                    : "Out of Stock"}
                </p>
                <p>
                  <strong>Exchangable: </strong>
                  {productToView.exchangable === 1 ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Refundable: </strong>
                  {productToView.refundable === 1 ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Description: </strong>
                  {productToView.description}
                </p>
                <p>
                  <strong>Created By: </strong>
                  {productToView.created_by}
                </p>
                <p>
                  <strong>Created Date: </strong>
                  {new Date(productToView.created_date).toLocaleString()}
                </p>
                <p>
                  <strong>Modified By: </strong>
                  {productToView.modified_by}
                </p>
                <p>
                  <strong>Modified Date: </strong>
                  {new Date(productToView.modified_date).toLocaleString()}
                </p>

                {/* Display Image 1 */}
                <p>
                  <strong>Image 1: </strong>
                  {productToView.image &&
                  productToView.image !== "/uploads/null" ? (
                    <img
                      src={productToView.image}
                      alt="Product 1"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "300px",
                        objectFit: "contain",
                        marginTop: "10px",
                        borderRadius: "5px",
                      }}
                    />
                  ) : (
                    <span>No image available</span>
                  )}
                </p>

                {/* Display Image 2 */}
                <p>
                  <strong>Image 2: </strong>
                  {productToView.image2 &&
                  productToView.image2 !== "/uploads/null" ? (
                    <img
                      src={productToView.image2}
                      alt="Product 2"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "300px",
                        objectFit: "contain",
                        marginTop: "10px",
                        borderRadius: "5px",
                      }}
                    />
                  ) : (
                    <span>No image available</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Editing Product */}
      {showProductEditModal && productToEdit && (
        <div
          className="modal"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  onClick={closeProductEditModal}
                >
                  <span>&times;</span>
                </button>
                <h4 className="modal-title">Edit Product</h4>
              </div>
              <form onSubmit={handleProductUpdate}>
                <div className="modal-body">
                  {/* Product Name */}
                  <div className="form-group">
                    <label>Product Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={productToEdit.product_name}
                      onChange={(e) =>
                        setProductToEdit({
                          ...productToEdit,
                          product_name: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Exchangable */}
                  <div className="form-group">
                    <label>Exchangable</label>
                    <select
                      className="form-control"
                      value={productToEdit.exchangable}
                      onChange={(e) =>
                        setProductToEdit({
                          ...productToEdit,
                          exchangable: e.target.value,
                        })
                      }
                    >
                      <option value={1}>Yes</option>
                      <option value={0}>No</option>
                    </select>
                  </div>

                  {/* Price */}
                  <div className="form-group">
                    <label>Price</label>
                    <input
                      type="text" // Use type="text" for regex validation
                      className="form-control"
                      value={productToEdit.price}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        if (/^\d*$/.test(newValue) && newValue.length <= 6) {
                          setProductToEdit({
                            ...productToEdit,
                            price: newValue,
                          });
                        }
                      }}
                    />
                  </div>

                  {/* Unit */}
                  <div className="form-group">
                    <label>Unit</label>
                    <input
                      type="text"
                      className="form-control"
                      value={productToEdit.unit}
                      onChange={(e) =>
                        setProductToEdit({
                          ...productToEdit,
                          unit: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Quantity */}
                  <div className="form-group">
                    <label>Quantity</label>
                    <input
                      type="number"
                      className="form-control"
                      value={productToEdit.quantity}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        if (newValue.length <= 5) {
                          setProductToEdit({
                            ...productToEdit,
                            quantity: newValue,
                          });
                        }
                      }}
                    />
                  </div>

                  {/* Refundable */}
                  <div className="form-group">
                    <label>Refundable</label>
                    <select
                      className="form-control"
                      value={productToEdit.refundable}
                      onChange={(e) =>
                        setProductToEdit({
                          ...productToEdit,
                          refundable: e.target.value,
                        })
                      }
                    >
                      <option value={1}>Yes</option>
                      <option value={0}>No</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      className="form-control"
                      value={productToEdit.description}
                      onChange={(e) =>
                        setProductToEdit({
                          ...productToEdit,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  {/* Image 1 URL */}
                  <div className="form-group">
                    <label>Image 1 URL</label>
                    <div className="d-flex align-items-center">
                      <input
                        type="text"
                        className="form-control"
                        style={{ marginRight: "10px" }} // Add custom spacing between input and button
                        value={productToEdit.image}
                        onChange={(e) =>
                          setProductToEdit({
                            ...productToEdit,
                            image: e.target.value,
                          })
                        }
                      />
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => fileInputRef.current.click()} // Trigger the file input click event
                      >
                        Upload File
                      </button>
                      {/* Hidden file input */}
                      <input
                        ref={fileInputRef} // Using a ref to handle the file input
                        type="file"
                        accept="image/*" // Accept only image files
                        style={{ display: "none" }} // Hide the file input
                        onChange={(e) => handleFileChange(e, "image")} // Handle file change
                      />
                    </div>
                  </div>

                  {/* Image 2 URL */}

                  <div className="form-group">
                    <label>Image 2 URL</label>
                    <div className="d-flex align-items-center">
                      <input
                        type="text"
                        className="form-control"
                        style={{ marginRight: "10px" }} // Add custom spacing between input and button
                        value={productToEdit.image2}
                        onChange={(e) =>
                          setProductToEdit({
                            ...productToEdit,
                            image2: e.target.value,
                          })
                        }
                      />
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => fileInputRef2.current.click()} // Trigger the file input click event
                      >
                        Upload File
                      </button>
                      {/* Hidden file input */}
                      <input
                        ref={fileInputRef2} // Using a ref to handle the file input
                        type="file"
                        accept="image/*" // Accept only image files
                        style={{ display: "none" }} // Hide the file input
                        onChange={(e) => handleFileChange(e, "image2")} // Handle file change
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeProductEditModal}
                  >
                    Cancel
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
    </div>
  );
};

export default ViewProduct;
