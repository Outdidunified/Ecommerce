import React, { useState, useEffect } from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import { useLocation } from "react-router-dom";
import Mobileview from "../../Components/Mobileview";
import MultiStepProgressBar from "../../Components/MultiStepProgressBar/MultiStepProgressBar";

const Ordertracking = ({ handleLogout, userdata }) => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const { order } = location.state || {}; // Access the order passed as state

  // Define order status steps
  const statusOrder = ['Confirmed', 'Dispatched', 'Shipped', 'Out for Delivery', 'Delivered'];

  // Calculate the current step based on the order status
  const currentStatusIndex = statusOrder.indexOf(order?.status); // Dynamic index based on order status

  useEffect(() => {
    // Set a timeout to stop the loader after 2 seconds
    const timer = setTimeout(() => {
      setIsLoading(false); // Hide loader and show content
    }, 1000); // 1 second delay

    // Cleanup the timeout on component unmount
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {isLoading ? (
        <div className="fullpage-loader">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      ) : (
        <>
          <Header handleLogout={handleLogout} userdata={userdata} />
          <Mobileview userdata={userdata} />

          {/* Breadcrumb Section Start */}
          <section className="breadcrumb-section pt-0">
            <div className="container-fluid-lg">
              <div className="row">
                <div className="col-12">
                  <div className="breadcrumb-contain">
                    <h2>Order Tracking</h2>
                    <nav>
                      <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item">
                          <a href="index.html">
                            <i className="fa-solid fa-house"></i>
                          </a>
                        </li>
                        <li className="breadcrumb-item active">Order Tracking</li>
                      </ol>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Breadcrumb Section End */}

          {/* Order Detail Section Start */}
          <section className="order-detail mb-2">
            <div className="container-fluid-lg">
              <div className="row g-sm-4 g-3">
                <div className="col-xxl-3 col-xl-4 col-lg-6">
                  <div className="order-image">
                    {order.items.length > 0 ? (
                      <img
                        src={`${order.items[0].product_image}`}
                        className="img-fluid blur-up lazyload"
                        alt={order.items[0].product_name}
                      />
                    ) : (
                      <img
                        src="../assets/images/vegetable/product/1.png"
                        className="img-fluid blur-up lazyload"
                        alt="No image available"
                      />
                    )}
                  </div>
                </div>

                <div className="col-xxl-9 col-xl-8 col-lg-6">
                  <div className="row g-sm-4 g-3">
                    <div className="col-xl-4 col-sm-6">
                      <div className="order-details-contain">
                        <div className="order-tracking-icon">
                          <i data-feather="package" className="text-content"></i>
                        </div>

                        <div className="order-details-name">
                          <h5 className="text-content">Tracking Code</h5>
                          <h2 className="theme-color">{order.tracking_code}</h2>
                        </div>
                      </div>
                    </div>

                    <div className="col-xl-4 col-sm-6">
                      <div className="order-details-contain">
                        <div className="order-tracking-icon">
                          <i className="text-content" data-feather="map-pin"></i>
                        </div>

                        <div className="order-details-name">
                          <h5 className="text-content">Destination</h5>
                          <h4>{order.city}</h4>
                        </div>
                      </div>
                    </div>

                    <div className="col-xl-4 col-sm-6">
                      <div className="order-details-contain">
                        <div className="order-tracking-icon">
                          <i className="text-content" data-feather="calendar"></i>
                        </div>

                        <div className="order-details-name">
                          <h5 className="text-content">Estimated Time</h5>
                          <h4>
                            {order.expected_delivery_date
                              ? order.expected_delivery_date
                              : "N/A"}
                          </h4>
                        </div>
                      </div>
                    </div>

                    <div className="col-12 overflow-hidden ">
                      <MultiStepProgressBar 
                        orderStatus={order.order_status} // Pass the current order status
                        statusOrder={statusOrder} // Pass the status order array
                      />
                    </div>

                    {/* Status Titles */}
                    {/* <div className="order-status-titles">
                      {statusOrder.map((status, index) => (
                        <div key={index} className={`status-title ${index <= currentStatusIndex ? "completed" : ""}`}>
                          <p>{status}</p>
                        </div>
                      ))}
                    </div> */}

                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Order Detail Section End */}

          <Footer />
        </>
      )}
    </div>
  );
};

export default Ordertracking;
