import React, { useEffect, useState } from "react";
import feather from "feather-icons";
import { Link } from "react-router-dom";
import Sidebar from '../Sidebar/Sidebar'; // Import the Sidebar component

const Header = ({ handleLogout, adminData }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // State to manage sidebar visibility
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    // Replace placeholders with Feather icons
    feather.replace();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevent form submission
    // Your search logic here
  };

  const handleClick = () => {
    // Call the handleLogout function passed from the parent
    if (handleLogout) {
      handleLogout();
    } else {
      console.error("handleLogout is not a function");
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen((prevState) => !prevState); // Toggle sidebar state
  };


  
    // Toggle dropdown visibility
    const toggleDropdown = (dropdownName) => {
      setActiveDropdown((prevState) =>
        prevState === dropdownName ? null : dropdownName // If the same dropdown is clicked, close it, else open the clicked one
      );
    };

  return (
    <div>
      {/* page-wrapper Start*/}
    <div class="page-wrapper compact-wrapper" id="pageWrapper">
       {/* Page Header Start*/}
        <div class="page-header">
            <div class="header-wrapper m-0">
                <div class="header-logo-wrapper p-0">
                    <div class="logo-wrapper">
                        <a href="index.html"/>
                            <img class="img-fluid main-logo" src="assets/images/logo/1.png" alt="logo"/>
                            <img class="img-fluid white-logo" src="assets/images/logo/1-white.png" alt="logo"/>
                      
                    </div>
                 
                    <div className="toggle-sidebar">
              <i
                className="status_toggle middle sidebar-toggle"
                data-feather="align-center"
                onClick={toggleSidebar}
              ></i>
              <a href="index.html">
                            <img src="assets/images/logo/1.png" class="img-fluid" alt=""/>
                        </a>
            </div>
                </div>

                <form class="form-inline search-full" action="javascript:void(0)" method="get">
                    <div class="form-group w-100">
                        <div class="Typeahead Typeahead--twitterUsers">
                            <div class="u-posRelative">
                                <input class="demo-input Typeahead-input form-control-plaintext w-100" type="text"
                                    placeholder="Search Fastkart .." name="q" title="" autofocus/>
                                <i class="close-search" data-feather="x"></i>
                                <div class="spinner-border Typeahead-spinner" role="status">
                                    <span class="sr-only">Loading...</span>
                                </div>
                            </div>
                            <div class="Typeahead-menu"></div>
                        </div>
                    </div>
                </form>
                <div class="nav-right col-6 pull-right right-header p-0">
                    <ul class="nav-menus">
                        <li>
                            <span class="header-search">
                                <i class="ri-search-line"></i>
                            </span>
                        </li>
                        <li class="onhover-dropdown">
                            <div class="notification-box">
                                <i class="ri-notification-line"></i>
                                <span class="badge rounded-pill badge-theme">4</span>
                            </div>
                            <ul class="notification-dropdown onhover-show-div">
                                <li>
                                    <i class="ri-notification-line"></i>
                                    <h6 class="f-18 mb-0">Notitications</h6>
                                </li>
                                <li>
                                    <p>
                                        <i class="fa fa-circle me-2 font-primary"></i>Delivery processing <span
                                            class="pull-right">10 min.</span>
                                    </p>
                                </li>
                                <li>
                                    <p>
                                        <i class="fa fa-circle me-2 font-success"></i>Order Complete<span
                                            class="pull-right">1 hr</span>
                                    </p>
                                </li>
                                <li>
                                    <p>
                                        <i class="fa fa-circle me-2 font-info"></i>Tickets Generated<span
                                            class="pull-right">3 hr</span>
                                    </p>
                                </li>
                                <li>
                                    <p>
                                        <i class="fa fa-circle me-2 font-danger"></i>Delivery Complete<span
                                            class="pull-right">6 hr</span>
                                    </p>
                                </li>
                                <li>
                                    <a class="btn btn-primary" href="javascript:void(0)">Check all notification</a>
                                </li>
                            </ul>
                        </li>

                        <li>
                            <div class="mode">
                                <i class="ri-moon-line"></i>
                            </div>
                        </li>
                        <li class="profile-nav onhover-dropdown pe-0 me-0">
                            <div class="media profile-media">
                                <img class="user-profile rounded-circle" src="assets/images/users/4.jpg" alt=""/>
                                <div class="user-name-hide media-body">
                                    <span>Emay Walter</span>
                                    <p class="mb-0 font-roboto">Admin<i class="middle ri-arrow-down-s-line"></i></p>
                                </div>
                            </div>
                            <ul class="profile-dropdown onhover-show-div">
                                <li>
                                    <a href="all-users.html">
                                        <i data-feather="users"></i>
                                        <span>Users</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="order-list.html">
                                        <i data-feather="archive"></i>
                                        <span>Orders</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="support-ticket.html">
                                        <i data-feather="phone"></i>
                                        <span>Spports Tickets</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="profile-setting.html">
                                        <i data-feather="settings"></i>
                                        <span>Settings</span>
                                    </a>
                                </li>
                                <li>
                                    <a data-bs-toggle="modal" data-bs-target="#staticBackdrop" href="">
                                        <i data-feather="log-out"></i>
                                        <span>Log out</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
       {/* Page Header Ends*/}

       {/* Page Body Start*/}
        <div className={`page-body-wrapper ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className={`sidebar-wrapper ${sidebarOpen ? 'sidebar-open' : ''}`}>
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
                        <Link className="sidebar-link sidebar-title link-nav" to="/dashboard">
                          <i className="ri-home-line"></i>
                          <span>Dashboard</span>
                        </Link>
                      </li>
        
                      {/* Product Dropdown */}
                      <li className="sidebar-list">
                        <a
                          className="linear-icon-link sidebar-link sidebar-title"
                          // href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleDropdown('product');
                          }}
                        >
                          <i className="ri-store-3-line"></i>
                          <span>Product</span>
                        </a>
                        <ul className={`sidebar-submenu ${activeDropdown === 'product' ? 'd-block' : 'd-none'}`}>
                          <li>
                            <Link to="/viewproduct">Products</Link>
                          </li>
                          <li>
                            <Link to="/addproduct">Add New Product</Link>
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
                            toggleDropdown('category');
                          }}
                        >
                          <i className="ri-list-check-2"></i>
                          <span>Category</span>
                        </a>
                        <ul className={`sidebar-submenu ${activeDropdown === 'category' ? 'd-block' : 'd-none'}`}>
                          <li>
                            <Link to="/viewcategory">Category List</Link>
                          </li>
                          <li>
                            <Link to="/addcategory">Add New Category</Link>
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
                            toggleDropdown('users');
                          }}
                        >
                          <i className="ri-user-3-line"></i>
                          <span>Users</span>
                        </a>
                        <ul className={`sidebar-submenu ${activeDropdown === 'users' ? 'd-block' : 'd-none'}`}>
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
                            toggleDropdown('roles');
                          }}
                        >
                          <i className="ri-user-3-line"></i>
                          <span>Roles</span>
                        </a>
                        <ul className={`sidebar-submenu ${activeDropdown === 'roles' ? 'd-block' : 'd-none'}`}>
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
                            toggleDropdown('settings');
                          }}
                        >
                          <i className="ri-settings-2-line"></i>
                          <span>Settings</span>
                        </a>
                        <ul className={`sidebar-submenu ${activeDropdown === 'settings' ? 'd-block' : 'd-none'}`}>
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
       {/* Page Body End */}
    </div>
   {/* page-wrapper End*/}</div>
   
  );
};

export default Header;
