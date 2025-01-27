// Mobileview.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-custom-alert';

import 'react-custom-alert/dist/index.css';
import { FaUser } from 'react-icons/fa'; // Import the user icon

const Mobileview = ({ userdata }) => {
  const navigate = useNavigate();
  const isLoggedIn = userdata && userdata.user_name;

  const handleCartClick = (e) => {
    e.preventDefault(); // Prevent default navigation behavior
    if (isLoggedIn) {
      navigate('/addtocart');
    } else {
      toast.info(
        <div>
          <span>Please log in to view your cart.</span>
          <button
            style={{
              marginLeft: '10px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'red',
            }}
            onClick={() => navigate('/login')}
          >
            Log In to continue
          </button>
        </div>,
        {
          position: 'top-center',
          autoClose: false,
          closeButton: false,
        }
      );
    }
  };

  const handleMyOrdersClick = (e) => {
    e.preventDefault(); // Prevent default navigation behavior
    if (isLoggedIn) {
      navigate('/orders');
    } else {
      toast.info(
        <div>
          <span>Please log in to view your orders.</span>
          <button
            style={{
              marginLeft: '10px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'red',
            }}
            onClick={() => navigate('/login')}
          >
            Log In to continue
          </button>
        </div>,
        {
          position: 'top-center',
          autoClose: false,
          closeButton: false,
        }
      );
    }
  };

  return (
    <div>
      <div className="mobile-menu d-md-none d-block mobile-cart">
        <ul>
          <li className="active">
            <Link to="/">
              <i className="iconly-Home icli"></i>
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link onClick={handleMyOrdersClick}>
              <i className="iconly-Heart icli" />
              <span>My Orders</span>
            </Link>
          </li>
          <li>
            <Link to="/search">
              <i className="iconly-Search icli"></i>
              <span>Search</span>
            </Link>
          </li>
          <li>
            <Link onClick={handleCartClick}>
              <i className="iconly-Bag-2 icli fly-cate"></i>
              <span>Cart</span>
            </Link>
          </li>
          <li>
            <Link to="/profile">
              <FaUser className="icli" /> {/* Use the imported icon */}
              <span> Account</span>
            </Link>
          </li>
        </ul>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Mobileview;
