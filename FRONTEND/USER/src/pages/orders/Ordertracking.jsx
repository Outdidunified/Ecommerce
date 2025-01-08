import React, { useState, useEffect } from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import { useLocation } from "react-router-dom";
import Mobileview from "../../Components/Mobileview";

const Ordertracking = ({ handleLogout, userdata }) => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const { order } = location.state || {}; // Access the order passed as state
 

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
          <Mobileview userdata={userdata}/>

          {/* Breadcrumb Section Start */}
          <section class="breadcrumb-section pt-0">
            <div class="container-fluid-lg">
              <div class="row">
                <div class="col-12">
                  <div class="breadcrumb-contain">
                    <h2>Order Tracking</h2>
                    <nav>
                      <ol class="breadcrumb mb-0">
                        <li class="breadcrumb-item">
                          <a href="index.html">
                            <i class="fa-solid fa-house"></i>
                          </a>
                        </li>
                        <li class="breadcrumb-item active">Order Tracking</li>
                      </ol>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Breadcrumb Section End */}

          {/* Order Detail Section Start */}
          <section class="order-detail mb-5">
            <div class="container-fluid-lg">
              <div class="row g-sm-4 g-3">
                <div class="col-xxl-3 col-xl-4 col-lg-6">
                  <div class="order-image">
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

                <div class="col-xxl-9 col-xl-8 col-lg-6">
                  <div class="row g-sm-4 g-3">
                    <div class="col-xl-4 col-sm-6">
                      <div class="order-details-contain">
                        <div class="order-tracking-icon">
                          <i data-feather="package" class="text-content"></i>
                        </div>

                        <div class="order-details-name">
                          <h5 class="text-content">Tracking Code</h5>
                          <h2 class="theme-color">{order.tracking_code}</h2>
                        </div>
                      </div>
                    </div>

                    <div class="col-xl-4 col-sm-6">
                      <div class="order-details-contain">
                        <div class="order-tracking-icon">
                          <i class="text-content" data-feather="map-pin"></i>
                        </div>

                        <div class="order-details-name">
                          <h5 class="text-content">Destination</h5>
                          <h4>{order.city}</h4>
                        </div>
                      </div>
                    </div>

                    <div class="col-xl-4 col-sm-6">
                      <div class="order-details-contain">
                        <div class="order-tracking-icon">
                          <i class="text-content" data-feather="calendar"></i>
                        </div>

                        <div class="order-details-name">
                          <h5 class="text-content">Estimated Time</h5>
                          <h4>
                            {order.expected_delivery_date
                              ? order.expected_delivery_date
                              : "N/A"}
                          </h4>
                        </div>
                      </div>
                    </div>

                    <div class="col-12 overflow-hidden">
                      <ol class="progtrckr">
                        <li class="progtrckr-done">
                          <h5>Pending</h5>
                          <h6>05:43 AM</h6>
                        </li>
                        <li class="progtrckr-done">
                          <h5>Confirmed</h5>
                          <h6>01:21 PM</h6>
                        </li>

                        <li class="progtrckr-done">
                          <h5>Dispatched</h5>
                          <h6>Pending</h6>
                        </li>
                        <li class="progtrckr-todo">
                          <h5>Shipped</h5>
                          <h6>Pending</h6>
                        </li>

                        <li class="progtrckr-todo">
                          <h5>Out for delivery</h5>
                          <h6>Pending</h6>
                        </li>
                        <li class="progtrckr-todo">
                          <h5>Delivered</h5>
                          <h6>Pending</h6>
                        </li>
                      </ol>
                    </div>
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
