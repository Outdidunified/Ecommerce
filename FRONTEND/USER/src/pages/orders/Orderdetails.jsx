import React, { useState, useEffect } from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';

import { useLocation, useNavigate} from 'react-router-dom';
import Mobileview from '../../Components/Mobileview';


const OrderDetails = ({ handleLogout, userdata }) => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
    const { order } = location.state || {}; // Access the order passed as state
   
        const navigate = useNavigate(); // Use the navigate hook

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
      {isLoading ? (   // Loader - will show until the isLoading state is false
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
                    <div class="breadcrumb-contain breadcrumb-order">
                        <div class="order-box">
                            <div class="order-image">
                                <div class="checkmark">
                                    <svg class="star" height="19" viewBox="0 0 19 19" width="19"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M8.296.747c.532-.972 1.393-.973 1.925 0l2.665 4.872 4.876 2.66c.974.532.975 1.393 0 1.926l-4.875 2.666-2.664 4.876c-.53.972-1.39.973-1.924 0l-2.664-4.876L.76 10.206c-.972-.532-.973-1.393 0-1.925l4.872-2.66L8.296.746z">
                                        </path>
                                    </svg>
                                    <svg class="star" height="19" viewBox="0 0 19 19" width="19"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M8.296.747c.532-.972 1.393-.973 1.925 0l2.665 4.872 4.876 2.66c.974.532.975 1.393 0 1.926l-4.875 2.666-2.664 4.876c-.53.972-1.39.973-1.924 0l-2.664-4.876L.76 10.206c-.972-.532-.973-1.393 0-1.925l4.872-2.66L8.296.746z">
                                        </path>
                                    </svg>
                                    <svg class="star" height="19" viewBox="0 0 19 19" width="19"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M8.296.747c.532-.972 1.393-.973 1.925 0l2.665 4.872 4.876 2.66c.974.532.975 1.393 0 1.926l-4.875 2.666-2.664 4.876c-.53.972-1.39.973-1.924 0l-2.664-4.876L.76 10.206c-.972-.532-.973-1.393 0-1.925l4.872-2.66L8.296.746z">
                                        </path>
                                    </svg>
                                    <svg class="star" height="19" viewBox="0 0 19 19" width="19"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M8.296.747c.532-.972 1.393-.973 1.925 0l2.665 4.872 4.876 2.66c.974.532.975 1.393 0 1.926l-4.875 2.666-2.664 4.876c-.53.972-1.39.973-1.924 0l-2.664-4.876L.76 10.206c-.972-.532-.973-1.393 0-1.925l4.872-2.66L8.296.746z">
                                        </path>
                                    </svg>
                                    <svg class="star" height="19" viewBox="0 0 19 19" width="19"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M8.296.747c.532-.972 1.393-.973 1.925 0l2.665 4.872 4.876 2.66c.974.532.975 1.393 0 1.926l-4.875 2.666-2.664 4.876c-.53.972-1.39.973-1.924 0l-2.664-4.876L.76 10.206c-.972-.532-.973-1.393 0-1.925l4.872-2.66L8.296.746z">
                                        </path>
                                    </svg>
                                    <svg class="star" height="19" viewBox="0 0 19 19" width="19"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M8.296.747c.532-.972 1.393-.973 1.925 0l2.665 4.872 4.876 2.66c.974.532.975 1.393 0 1.926l-4.875 2.666-2.664 4.876c-.53.972-1.39.973-1.924 0l-2.664-4.876L.76 10.206c-.972-.532-.973-1.393 0-1.925l4.872-2.66L8.296.746z">
                                        </path>
                                    </svg>
                                    <svg class="checkmark__check" height="36" viewBox="0 0 48 36" width="48"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M47.248 3.9L43.906.667a2.428 2.428 0 0 0-3.344 0l-23.63 23.09-9.554-9.338a2.432 2.432 0 0 0-3.345 0L.692 17.654a2.236 2.236 0 0 0 .002 3.233l14.567 14.175c.926.894 2.42.894 3.342.01L47.248 7.128c.922-.89.922-2.34 0-3.23">
                                        </path>
                                    </svg>
                                    <svg class="checkmark__background" height="115" viewBox="0 0 120 115" width="120"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M107.332 72.938c-1.798 5.557 4.564 15.334 1.21 19.96-3.387 4.674-14.646 1.605-19.298 5.003-4.61 3.368-5.163 15.074-10.695 16.878-5.344 1.743-12.628-7.35-18.545-7.35-5.922 0-13.206 9.088-18.543 7.345-5.538-1.804-6.09-13.515-10.696-16.877-4.657-3.398-15.91-.334-19.297-5.002-3.356-4.627 3.006-14.404 1.208-19.962C10.93 67.576 0 63.442 0 57.5c0-5.943 10.93-10.076 12.668-15.438 1.798-5.557-4.564-15.334-1.21-19.96 3.387-4.674 14.646-1.605 19.298-5.003C35.366 13.73 35.92 2.025 41.45.22c5.344-1.743 12.628 7.35 18.545 7.35 5.922 0 13.206-9.088 18.543-7.345 5.538 1.804 6.09 13.515 10.696 16.877 4.657 3.398 15.91.334 19.297 5.002 3.356 4.627-3.006 14.404-1.208 19.962C109.07 47.424 120 51.562 120 57.5c0 5.943-10.93 10.076-12.668 15.438z">
                                        </path>
                                    </svg>
                                </div>
                            </div>

                            <div class="order-contain">
                                <h3 class="theme-color">Order Success</h3>
                                <h5 class="text-content">Payment Is Successfully And Your Order Is On The Way</h5>
                                <h6>Transaction ID: {order.razorpay_payment_id}</h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    {/* Breadcrumb Section End */}

    {/* Cart Section Start */}
    <section class="cart-section section-b-space">
        <div class="container-fluid-lg">
            <div class="row g-sm-4 g-3">
            <div className="col-xxl-9 col-lg-8">
            <div className="cart-table order-table order-table-2">
                <div className="table-responsive">
                    <table className="table mb-0">
                        <tbody>
                            {order.items.map((item) => (
                                <tr key={item.product_id}>
                                    <td className="product-detail">
                                        <div className="product border-0">
                                            <a href="product.left-sidebar.html" className="product-image">
                                                <img 
                                                    src={item.product_image} 
                                                    className="img-fluid blur-up lazyload" 
                                                    alt={item.product_name} 
                                                />
                                            </a>
                                            <div className="product-detail">
                                                <ul>
                                                    <li className="name">
                                                        <a href="product-left-thumbnail.html">{item.product_name}</a>
                                                    </li>
                                                    <li className="text-content">Sold By: {order.user_name}</li>
                                                    <li className="text-content">Quantity - {item.quantity} {item.product_name.includes("g") ? "g" : ""}</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="price">
                                        <h4 className="table-title text-content">Price</h4>
                                        <h6 className="theme-color">${item.price}</h6>
                                    </td>

                                    <td className="quantity">
                                        <h4 className="table-title text-content">Qty</h4>
                                        <h4 className="text-title">{item.quantity}</h4>
                                    </td>

                                    <td className="subtotal">
                                        <h4 className="table-title text-content">Total</h4>
                                        <h5>Rs.{item.total_price}</h5>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

                <div class="col-xxl-3 col-lg-4">
                    <div class="row g-4">
                    <div className="col-lg-12 col-sm-6">
    <div className="summery-box">
        <div className="summery-header">
            <h3>Price Details</h3>
            <h5 className="ms-auto theme-color">({order.items.reduce((acc, item) => acc + item.quantity, 0)} Items)</h5>
        </div>

        <ul className="summery-total">
            <li className="list-total">
                <h4>Total (INR)</h4>
                <h4 className="price">Rs.{order.items.reduce((acc, item) => acc + item.total_price * item.quantity, 0).toFixed(2)}</h4>
            </li>
        </ul>
    </div>
</div>

<div className="col-lg-12 col-sm-6">
    <div className="summery-box">
        <div className="summery-header d-block">
            <h3>Shipping Address</h3>
        </div>

        <ul className="summery-contain pb-0 border-bottom-0">
            <li className="d-block">
                <h4>House No: {order.house_no}, Road: {order.road_name}</h4>
                <h4 className="mt-2">
                    City: {order.city}, State: {order.state}, Pincode: {order.pincode}
                </h4>
            </li>

            <li className="pb-0">
                <h4>Contact Number:</h4>
                <h4 className="theme-color">{order.contact_number}</h4>
            </li>

            <li className="pb-0">
            
        
        <a 
            
            className="text-danger"
            onClick={() => navigate("/ordertracking", { state: { order } })}
        >
            Track Order
        </a>
  
            </li>
        </ul>

        <ul className="summery-total">
            <li className="list-total border-top-0 pt-2">
                <h4 className="fw-bold">Delivery Date: {order.expected_delivery_date || "Not Available"}</h4>
            </li>
        </ul>
    </div>
</div>


                        <div class="col-12">
    <div class="summery-box">
        <div class="summery-header d-block">
            <h3>Payment Method</h3>
        </div>

        <ul class="summery-contain pb-0 border-bottom-0">
            <li class="d-block pt-0">
                <p class="text-content">Online Payment (Card/Net Banking). All online payments are subject to payment gateway acceptance.</p>
            </li>
        </ul>
    </div>
</div>

                    </div>
                </div>
            </div>
        </div>
    </section>
    {/* Cart Section End */}

          <Footer />
        </>
      )}
    </div>
  );
};

export default OrderDetails;
