import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "remixicon/fonts/remixicon.css";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/footer";
import { ToastContainer, toast } from "react-custom-alert";
import "react-custom-alert/dist/index.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // For styling
import { format } from "date-fns";

const Orderlist = ({ handleLogout, adminData }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderViewModal, setShowOrderViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [orderStatus, setOrderStatus] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState(null); // Initialize with null
  const [isValidDate, setIsValidDate] = useState(true);
  const navigate = useNavigate();

  const handleRowClick = (order) => {
    navigate(`/orderdetail`, { state: { order } }); // Pass the entire order data in state
  };

  const handletracking = (order) => {
    navigate(`/ordertracking`, { state: { order } }); // Pass the entire order data in state
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/orders/orderforadmin");
        if (response.data && Array.isArray(response.data.orders)) {
          setOrders(response.data.orders);
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (err) {
        setError("Error fetching orders");
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);


  const handleCloseModal = () => {
    setShowOrderViewModal(false);
    setShowEditModal(false);
    setSelectedOrder(null);
    setOrderStatus("");
    setEstimatedDelivery(null); // Reset the date to null
  };
  const handleEditClick = (order) => {
    // Parse the date string to a valid Date object
    const parsedDate = order.expected_delivery_date
      ? new Date(order.expected_delivery_date.split("/").reverse().join("-"))
      : null;
  
    setSelectedOrder(order);
    setOrderStatus(order.order_status);
    setEstimatedDelivery(parsedDate); // Set the parsed date or null
    setShowEditModal(true);
  };
  const handleDateChange = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      setEstimatedDelivery(date); // Set valid date
      setIsValidDate(true);
    } else {
      setIsValidDate(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!isValidDate || !orderStatus) {
      toast.error("Please enter valid details.");
      return;
    }
  
    // Format the date to dd/MM/yyyy
    const formattedDate = format(estimatedDelivery, "dd/MM/yyyy");
  
    const requestData = {
      status: orderStatus,
      order_id: selectedOrder.order_id,
      expected_delivery_date: formattedDate,
      modified_by: adminData.admin_name,
    };
  
    try {
      const response = await axios.put("/orders/updatestatus", requestData);
      if (response.status === 200) {
        toast.success("Updated successfully");
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.order_id === selectedOrder.order_id
              ? { ...order, order_status: orderStatus, expected_delivery_date: formattedDate }
              : order
          )
        );
        handleCloseModal();
      } else {
        toast.error("Error in updating order.");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Error in updating order.");
    }
  };
  
  return (
    <div>
      {/* Page wrapper starts */}
      <div className="page-wrapper compact-wrapper" id="pageWrapper">
        {/* Page Header */}
        <Header handleLogout={handleLogout} adminData={adminData} />

        {/* Page Body Start */}
        <div className="page-body-wrapper">
          {/* Page Sidebar */}
          <Sidebar />

          {/* Container-fluid starts */}
          <div className="page-body">
            <div className="container-fluid">
              <div className="row">
                <div className="col-sm-12">
                  <div className="card card-table">
                    <div className="card-body">
                      <div className="title-header option-title">
                        <h5>Order List</h5>
                      </div>
                      <div>
                        <div className="table-responsive">
                          <table
                            className="table all-package order-table theme-table"
                            id="table_id"
                          >
                            <thead>
                              <tr>
                                <th>Order Image</th>
                                <th>Order Id</th>
                                <th>Expected Delivery Date</th>
                                <th>Payment Method</th>
                                <th>Delivery Status</th>
                                <th>Amount</th>
                                <th>Option</th>
                              </tr>
                            </thead>
                            <tbody>
                              {orders.map((order) => (
                                <tr key={order.order_id}>
                                  <td>
                                    <a className="d-block">
                                      <span className="order-image">
                                        <img
                                          src={
                                            order.items[0]?.product_image &&
                                            order.items[0].product_image !==
                                              "/uploads/null"
                                              ? `${order.items[0].product_image}`
                                              : "/images/placeholder.jpg"
                                          }
                                          alt={
                                            order.items[0]?.product_name ||
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
                                      </span>
                                    </a>
                                  </td>
                                  <td>{order.order_id}</td>
                                  <td>
                                    {order.expected_delivery_date
                                      ? order.expected_delivery_date
                                      : "N/A"}
                                  </td>

                                  <td>{order.payment_status}</td>
                                  <td
                                    style={{
                                      color:
                                        order.order_status === "Delivered"
                                          ? "green"
                                          : order.order_status === "Shipped"
                                          ? "blue"
                                          : order.order_status === "Dispatched"
                                          ? "black"
                                          : order.order_status ===
                                            "Out for Delivery"
                                          ? "purple"
                                          : order.order_status === "Confirmed"
                                          ? "orange"
                                          : "red",
                                    }}
                                  >
                                    <span>{order.order_status}</span>
                                  </td>

                                  <td>Rs.{order.total_price}</td>
                                  <td>
                                    <ul>
                                      <li>
                                        <button
                                          onClick={() =>
                                            handleRowClick(order) // Pass the order to the handler
                                          }
                                          className="btn btn-link"
                                          aria-label="View order"
                                          style={{
                                            textDecoration: "none",
                                            color: "#000000",
                                            fontSize: "20px",
                                            padding: "10px",
                                          }}
                                        >
                                          <i className="ri-eye-line"></i>
                                        </button>
                                      </li>
                                      <li>
                                        <button
                                          onClick={() => handleEditClick(order)}
                                          className="btn btn-link"
                                          aria-label="Edit order"
                                          style={{
                                            textDecoration: "none",
                                            color: "#007bff",
                                            fontSize: "20px",
                                            padding: "10px",
                                          }}
                                        >
                                          <i className="ri-pencil-line"></i>
                                        </button>
                                      </li>
                                      <li>
                                      <Link
                                        className="btn btn-sm btn-solid text-white"
 to="/ordertracking"
 state={{
  order
 }}
>
  Tracking
</Link>

            </li>

                                    </ul>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <Footer />
          </div>
        </div>
      </div>

      {showEditModal && selectedOrder && (
        <div
          className="modal show"
          style={{
            display: "block",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
          onClick={handleCloseModal}
        >
          <div
            className="modal-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" onClick={handleCloseModal}>
                  <span>&times;</span>
                </button>
                <h4 className="modal-title">Edit Order</h4>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group mb-3">
                    <label
                      htmlFor="estimated-delivery"
                      className="custom-label d-block"
                    >
                      Estimated Delivery Date:
                    </label>
                    <DatePicker
  id="estimated-delivery"
  selected={estimatedDelivery || null}  // Default to null if the date is invalid
  onChange={handleDateChange}
  dateFormat="dd/MM/yyyy"
  className={`form-control ${isValidDate ? "" : "is-invalid"}`}
  placeholderText="Select a delivery date"
/>

                    {!isValidDate && (
                      <div className="invalid-feedback">
                        Please select a valid date.
                      </div>
                    )}
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="order-status" className="d-block">
                      Order Status:
                    </label>
                    <select
                      id="order-status"
                      className="form-control"
                      value={orderStatus}
                      onChange={(e) => setOrderStatus(e.target.value)}
                    >
                      <option value="">Select Status</option>
                     
                      <option value="Dispatched">Dispatched</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary mt-3 d-flex justify-content-center mx-auto"
                    disabled={!orderStatus || !isValidDate}
                  >
                    Save Changes
                  </button>
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

export default Orderlist;
