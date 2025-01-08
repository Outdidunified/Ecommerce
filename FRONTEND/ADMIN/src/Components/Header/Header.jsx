import React, { useEffect, useState } from "react";
import feather from "feather-icons";
import { Link } from "react-router-dom";
import Sidebar from '../Sidebar/Sidebar'; // Import the Sidebar component

const Header = ({ handleLogout, adminData }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // State to manage sidebar visibility

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

  return (
    <div>
      <div className="page-wrapper compact-wrapper" id="pageWrapper">
        <div className="page-header">
          <div className="header-wrapper m-0">
            <div className="header-logo-wrapper p-0">
              <div className="logo-wrapper">
                <a href="index.html">
                  <img
                    className="img-fluid main-logo"
                    src="assets/images/logo/1.png"
                    alt="logo"
                  />
                  <img
                    className="img-fluid white-logo"
                    src="assets/images/logo/1-white.png"
                    alt="logo"
                  />
                </a>
              </div>
              <div className="toggle-sidebar" onClick={toggleSidebar}>
                <i
                  className={`status_toggle middle sidebar-toggle ${sidebarOpen ? "open" : ""}`}
                  data-feather="align-center"
                ></i>
              </div>
            </div>

            <form
              className="form-inline search-full"
              onSubmit={handleSearchSubmit}
            >
              <div className="form-group w-100">
                <div className="Typeahead Typeahead--twitterUsers">
                  <div className="u-posRelative">
                    <input
                      className="demo-input Typeahead-input form-control-plaintext w-100"
                      type="text"
                      placeholder="Search Fastkart .."
                      name="q"
                      title=""
                      autoFocus
                    />
                    <i className="close-search" data-feather="x"></i>
                    <div
                      className="spinner-border Typeahead-spinner"
                      role="status"
                    >
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                  <div className="Typeahead-menu"></div>
                </div>
              </div>
            </form>

            <div className="nav-right col-6 pull-right right-header p-0">
              <ul className="nav-menus">
                <li>
                  <span className="header-search">
                    <i className="ri-search-line"></i>
                  </span>
                </li>

                <li className="profile-nav onhover-dropdown pe-0 me-0">
                  <div className="media profile-media">
                    <img
                      className="user-profile rounded-circle"
                      src="assets/images/users/4.jpg"
                      alt=""
                    />
                    <div className="user-name-hide media-body">
                      <span>{adminData?.admin_name || "Admin"}</span>
                      <p className="mb-0 font-roboto">
                        Admin
                        <i className="middle ri-arrow-down-s-line"></i>
                      </p>
                    </div>
                  </div>
                  <ul className="profile-dropdown onhover-show-div">
                    <li>
                      <Link to="/Allusers">
                        <i data-feather="users"></i>
                        <span>Users</span>
                      </Link>
                    </li>

                    <li>
                      <Link to="/Orderlist">
                        <i data-feather="archive"></i>
                        <span>Orders</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/Profilesetting">
                        <i data-feather="settings"></i>
                        <span>Settings</span>
                      </Link>
                    </li>

                    {/* Updated logout section */}
                    <li onClick={handleClick} style={{ cursor: "pointer" }}>
                      <button
                        type="button"
                        className="dropdown-item"
                        style={{ all: "unset" }}
                      >
                        <i data-feather="log-out"></i>
                        <span>Log out</span>
                      </button>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Conditionally render Sidebar */}
      {sidebarOpen && <Sidebar />}
    </div>
  );
};

export default Header;
