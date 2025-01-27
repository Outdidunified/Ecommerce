import React from 'react';
import 'remixicon/fonts/remixicon.css';
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from '../../Components/Sidebar/Sidebar';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/footer';
import MultiStepProgressBar from '../../Components/MultiStepProgressBar/MultiStepProgressBar'; // Import your custom progress bar


const Ordertracking = ({ handleLogout, adminData }) => {
  const location = useLocation();
  const { order } = location.state || {}; // Safely access order details
  const navigate = useNavigate();

  const handleTrackAnotherOrder = () => {
    navigate('/orderlist'); // Navigate to /orderlist
  };

  // Ensure order_status exists and check its value
  const orderStatus = order.order_status || '';
  console.log('Order Status:', orderStatus); // Debugging order status

  // Status steps in the order
  const statusOrder = ['Confirmed', 'Dispatched', 'Shipped', 'Out for Delivery', 'Delivered'];

  // Determine the index of the current order status
  const currentStatusIndex = statusOrder.indexOf(orderStatus);

  console.log('Current status index:', currentStatusIndex); // Debugging current status index

  // Check if the current status is "Delivered", and return a message or alternative view if necessary
  if (orderStatus === 'Delivered') {
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
                    <div className="row">
                      <div className="col-sm-12">
                        <div className="card">
                          <div className="card-body">
                            <div className="title-header option-title">
                              <h5>Order Tracking</h5>
                            </div>

                            {/* Delivered Status - New Design */}
                            <div className="order-status-card">
                              {/* Left-Aligned Order Information */}
                              <div className="order-content">
                                {/* Delivery Banner Section */}
                                <div className="delivery-banner">
                                  <div className="delivery-icon">
                                    <i className="ri-checkbox-circle-fill" style={{ fontSize: '3rem', color: 'green' }}></i>
                                  </div>
                                  <div className="delivery-message">
                                    <h3>Order Delivered</h3>
                                  </div>
                                </div>

                                {/* Order Details */}
                                <div className="order-details">
                                  <h4>{order.items[0]?.product_name || 'No Product Name'}</h4>
                                  <ul>
                                    <li><strong>Order Number:</strong> {order.order_id}</li>
                                    <li><strong>Tracking Code:</strong> {order.tracking_code}</li>
                                    <li><strong>Order Placed:</strong> {order.created_date || 'Unknown Date'}</li>
                                    <li><strong>Expected Delivery:</strong> {order.expected_delivery_date || 'Unknown Date'}</li>
                                    <li><strong>Payment Status:</strong> {order.payment_status || 'Pending'}</li>
                                  </ul>
                                </div>
                                <div className="order-status-info">
                                  <div className="status-button">
                                    <button className="btn btn-success" onClick={handleTrackAnotherOrder}>
                                      Track Another Order
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* Right-Aligned Product Image */}
                              <div className="order-product-image">
                                <img
                                  src={
                                    order.items && order.items.length > 0
                                      ? `http://localhost:6381${order.items[0].product_image}`
                                      : 'assets/images/placeholder.jpg'
                                  }
                                  className="img-fluid w-100 lazyload"
                                  alt="Product Image"
                                />
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
            <Footer />
          </div>
        </div>
      </div>
    );
  }

  // Render the order status progress bar if status is not "Delivered"
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
              <div className="row">
                <div className="col-sm-12">
                  <div className="card">
                    <div className="card-body">
                      <div className="title-header option-title">
                        <h5>Order Tracking</h5>
                      </div>
                      <div className="order-left-image">
                        <div className="tracking-product-image">
                          <img
                            src={
                              order.items && order.items.length > 0
                                ? `http://localhost:6381${order.items[0].product_image}`
                                : 'assets/images/placeholder.jpg'
                            }
                            className="img-fluid w-100 blur-up lazyload"
                            alt="Product Image"
                          />
                        </div>
                        <div className="order-image-contain">
                          <h4>{order.items[0]?.product_name || 'No Product Name'}</h4>
                          <div className="tracker-number">
                            <p>Order Number: <span>{order.order_id}</span></p>
                            <p>Tracking code: <span>{order.tracking_code}</span></p>
                            <p>Order Placed: <span>{order.created_date || 'Unknown Date'}</span></p>
                            <p>Expected delivery date: <span>{order.expected_delivery_date || 'Unknown Date'}</span></p>
                            <p>Payment Status: <span>{order.payment_status || 'Unknown Date'}</span></p>
                          </div>
                        </div>
                      </div>

                      <div className="order-status-progress mt-5">
  <MultiStepProgressBar 
    orderStatus={statusOrder[currentStatusIndex]} // Use the current status for the progress bar
    onPageNumberClick={(step) => {
      // Optional: Handle click event on step number (if needed)
    }}
  />
</div>

{/* Status Titles */}
<div className="order-status-titles">
  {statusOrder.map((status, index) => (
    <div key={index} className={`status-title ${index <= currentStatusIndex ? "completed" : ""}`}>
      <p>{status}</p>
    </div>
  ))}
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
</div>

  );
};

export default Ordertracking;
