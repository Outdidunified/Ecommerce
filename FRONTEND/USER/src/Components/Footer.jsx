import React, { useEffect, useState } from "react";
import axios from "axios";

import { ToastContainer, toast } from "react-custom-alert";
import "react-custom-alert/dist/index.css";
import { Link } from "react-router-dom";


const Footer = () => {
    const [categories, setCategories] = useState([]); // Initialize as an empty array
  

     // Fetch categories from API
     useEffect(() => {
        const fetchCategories = async () => {
          try {
            const response = await axios.get("/product/categoryname"); // Ensure this is your correct API endpoint
      
            // Assuming the API returns an array of categories, we only need the first 10
            if (Array.isArray(response.data.categories)) {
              setCategories(response.data.categories.slice(0, 10)); // Limit to the first 10 categories
            } else {
              console.error("Invalid categories data structure:", response.data);
              toast.error("Error fetching categories");
            }
          } catch (err) {
            console.error("Error fetching categories:", err);
            toast.error("Error fetching categories");
          }
        };
      
        fetchCategories();
      }, []);
      
  return (
    <div>
          {/* Footer Section Start*/}
    <footer class="section-t-space">
        <div class="container-fluid-lg">
            <div class="service-section">
                <div class="row g-3">
                    <div class="col-12">
                        <div class="service-contain">
                            <div class="service-box">
                                <div class="service-image">
                                    <img src="../assets/svg/product.svg" class="blur-up lazyload" alt=""/>
                                </div>

                                <div class="service-detail">
                                    <h5>Quality Products</h5>
                                </div>
                            </div>

                            <div class="service-box">
                                <div class="service-image">
                                    <img src="../assets/svg/delivery.svg" class="blur-up lazyload" alt=""/>
                                </div>

                                <div class="service-detail">
                                    <h5>Free Delivery For Order Over Rs.250</h5>
                                </div>
                            </div>

                            <div class="service-box">
                                <div class="service-image">
                                    <img src="../assets/svg/discount.svg" class="blur-up lazyload" alt=""/>
                                </div>

                                <div class="service-detail">
                                    <h5>Daily Mega Discounts</h5>
                                </div>
                            </div>

                            <div class="service-box">
                                <div class="service-image">
                                    <img src="../assets/svg/market.svg" class="blur-up lazyload" alt=""/>
                                </div>

                                <div class="service-detail">
                                    <h5>Best Price On The Market</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="main-footer section-b-space section-t-space">
                <div class="row g-md-4 g-3">
                    <div class="col-xl-3 col-lg-4 col-sm-6">
                        <div class="footer-logo">
                            <div class="theme-logo">
                                <a href="index.html">
                                    <img src="../assets/images/logo/1.png" class="blur-up lazyload" alt=""/>
                                </a>
                            </div>

                            <div class="footer-logo-contain">
                                <p>We are a friendly bar serving a variety of cocktails, wines and beers. Our bar is a
                                    perfect place for a couple.</p>

                                <ul class="address">
                                    <li>
                                        <i data-feather="home"></i>
                                        <p>1418 Riverwood Drive, CA 96052, US</p>
                                    </li>
                                    <li>
                                        <i data-feather="mail"></i>
                                        <p>support@fastkart.com</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6">
  <div className="footer-title">
    <h4>Categories</h4>
  </div>

  <div className="footer-contain">
  <ul>
    {categories.map((category) => (
      <li key={category.category_id}>
        <Link
          to="/categorypage"
          state={{
            categoryId: category.category_id,
            categoryName: category.category_name,
          }}
          className="text-content"
        >
          {category.category_name}
          <i
            className="fa-solid fa-angle-right"
            style={{ marginLeft: "10px" }}
          ></i>
        </Link>
      </li>
    ))}
  </ul>
</div>
</div>


<div className="col-xl col-lg-2 col-sm-3">
  <div className="footer-title">
    <h4>Useful Links</h4>
  </div>
  <div className="footer-contain">
    <ul>
      <li>
        <Link to="/" className="text-content">Home</Link>
      </li>
      <li>
        <Link to="/" className="text-content">Shop</Link>
      </li>
      <li>
        <Link to="/contact" className="text-content">Contact Us</Link>
      </li>
      <li>
        <Link to="/orders" className="text-content">Your Order</Link>
      </li>
      <li>
        <Link to="/profile" className="text-content">Your Account</Link>
      </li>
      
    </ul>
  </div>
</div>

<div className="col-xl col-lg-2 col-sm-3">
  <div className="footer-title">
    <h4>Any queries?</h4>
  </div>
  <div className="footer-contain">
    <ul>
      
      <li>
        <Link to="/contact" className="text-content">FAQ</Link>
      </li>
    
      
    </ul>
  </div>
</div>


                    <div class="col-xl-3 col-lg-4 col-sm-6">
                        <div class="footer-title">
                            <h4>Contact Us</h4>
                        </div>

                        <div class="footer-contact">
                            <ul>
                                <li>
                                    <div class="footer-number">
                                        <i data-feather="phone"></i>
                                        <div class="contact-number">
                                            <h6 class="text-content">Hotline 24/7 :</h6>
                                            <h5>+91 888 104 2340</h5>
                                        </div>
                                    </div>
                                </li>

                                <li>
                                    <div class="footer-number">
                                        <i data-feather="mail"></i>
                                        <div class="contact-number">
                                            <h6 class="text-content">Email Address :</h6>
                                            <h5>fastkart@hotmail.com</h5>
                                        </div>
                                    </div>
                                </li>

                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div class="sub-footer section-small-space">
                <div class="reserve">
                    <h6 class="text-content">©2022 Fastkart All rights reserved</h6>
                </div>

                <div class="payment">
                    <img src="../assets/images/payment/1.png" class="blur-up lazyload" alt=""/>
                </div>

                
            </div>
        </div>
    </footer>
       <ToastContainer />
  {/* Footer Section End*/}
      
    </div>
  )
}

export default Footer
