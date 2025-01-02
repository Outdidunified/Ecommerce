import React, { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ adminData }) => {
  // State to manage the currently active dropdown
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Toggle dropdown visibility
  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(
      (prevState) => (prevState === dropdownName ? null : dropdownName) // If the same dropdown is clicked, close it, else open the clicked one
    );
  };

  return (
    <div className="page-wrapper compact-wrapper" id="pageWrapper">
      <div className="page-body-wrapper">
        <div className="sidebar-wrapper">
          <div id="sidebarEffect"></div>
          <div>
            <div className="logo-wrapper logo-wrapper-center">
              <Link to="/">
                <img
                  className="img-fluid for-white"
                  src="assets/images/logo/full-white.png"
                  alt="logo"
                />
              </Link>
              <div className="back-btn">
                <i className="fa fa-angle-left"></i>
              </div>
              <div className="toggle-sidebar">
                <i className="ri-apps-line status_toggle middle sidebar-toggle"></i>
              </div>
            </div>
            <nav className="sidebar-main">
              <ul className="sidebar-links" id="simple-bar">
                <li className="sidebar-list">
                  <Link
                    className="sidebar-link sidebar-title link-nav"
                    to="/dashboard"
                  >
                    <i className="ri-home-line"></i>
                    <span>Dashboard</span>
                  </Link>
                </li>
                {/* Product Dropdown */}
                <li className="sidebar-list">
                  <a
                    className="sidebar-link sidebar-title"
                    // href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleDropdown("Product");
                    }}
                    
                  >
                    <i className="ri-store-3-line"></i>
                    <span>Product</span>
                  </a>
                  <ul
                    className={`sidebar-submenu ${
                      activeDropdown === "Product" ? "d-block" : "d-none"
                    }`}
                  >
                    <li>
                      <Link to="/Viewproduct"> Products</Link>
                    </li>
                    <li>
                      <Link to="/Addproduct">Add Product</Link>
                    </li>
                  </ul>
                </li>

                {/* Category Dropdown */}
                <li className="sidebar-list">
                  <a
                    className="linear-icon-link sidebar-link sidebar-title"
                    // href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleDropdown("category");
                    }}
                  >
                    <i className="ri-list-check-2"></i>
                    <span>Category</span>
                  </a>
                  <ul
                    className={`sidebar-submenu ${
                      activeDropdown === "category" ? "d-block" : "d-none"
                    }`}
                  >
                    <li>
                      <Link to="/viewcategory">Category List</Link>
                    </li>
                    <li>
                      <Link to="/addcategory">Add New Category</Link>
                    </li>
                  </ul>
                </li>

                {/* Order Dropdown */}
                <li class="sidebar-list">
                  <a
                    class="sidebar-link sidebar-title"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleDropdown("Orders");
                    }}
                  >
                    <i class="ri-archive-line"></i>
                    <span>Orders</span>
                  </a>
                  <ul
                    className={`sidebar-submenu ${
                      activeDropdown === "Orders" ? "d-block" : "d-none"
                    }`}
                  >
                    <li>
                      <Link to="/Orderlist">Order List</Link>
                    </li>
                    <li>
                      <Link to="/Orderdetail">Order Detail</Link>
                    </li>
                    <li>
                      <Link to="/Ordertracking">Order Tracking</Link>
                    </li>
                  </ul>
                </li>

                {/* Users Dropdown */}
                <li className="sidebar-list">
                  <a
                    className="sidebar-link sidebar-title"
                    // href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleDropdown("users");
                    }}
                  >
                    <i className="ri-user-3-line"></i>
                    <span>Users</span>
                  </a>
                  <ul
                    className={`sidebar-submenu ${
                      activeDropdown === "users" ? "d-block" : "d-none"
                    }`}
                  >
                    <li>
                      <Link to="/allusers">All Users</Link>
                    </li>
                    <li>
                      <Link to="/adduser">Add New User</Link>
                    </li>
                  </ul>
                </li>

                {/* Roles Dropdown */}
                <li className="sidebar-list">
                  <a
                    className="sidebar-link sidebar-title"
                    // href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleDropdown("roles");
                    }}
                  >
                    <i className="ri-user-3-line"></i>
                    <span>Roles</span>
                  </a>
                  <ul
                    className={`sidebar-submenu ${
                      activeDropdown === "roles" ? "d-block" : "d-none"
                    }`}
                  >
                    <li>
                      <Link to="/Allrole">All Roles</Link>
                    </li>
                    <li>
                      <Link to="/addrole">Create Role</Link>
                    </li>
                  </ul>
                </li>

                {/* Settings Dropdown */}
                <li className="sidebar-list">
                  <a
                    className="sidebar-link sidebar-title"
                    // href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleDropdown("settings");
                    }}
                  >
                    <i className="ri-settings-2-line"></i>
                    <span>Settings</span>
                  </a>
                  <ul
                    className={`sidebar-submenu ${
                      activeDropdown === "settings" ? "d-block" : "d-none"
                    }`}
                  >
                    <li>
                      <Link to="/Profilesetting">Profile Setting</Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
