import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import React, {  useState } from "react";
import Home from "./pages/Home";
import Categorypage from "./pages/Category/categorypage";
import Productpage from "./pages/Product/Productpage";
import Viewproducts from "./pages/Product/Viewproducts";
import Login from "./pages/Auth/login";
import Register from "./pages/Auth/Register";
import Forgotpassword from "./pages/Auth/Forgotpassword";
import Addtocart from "./pages/Add to cart/Addtocart";
import Orders from "./pages/orders/Order";
import Ordertracking from "./pages/orders/Ordertracking";
import Orderdetails from "./pages/orders/Orderdetails";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import Otp from "./pages/Auth/otp";
import {CartProvider} from "./Utilities/CartContext";
import Search from "./pages/Search";

function App() {
  const [token, setToken] = useState(localStorage.getItem("authToken"));
  const [userdata, setuserdata] = useState(() => {
    const storedData = localStorage.getItem("userdata");
    return storedData ? JSON.parse(storedData) : null;
  });
  const [loggedIn, setLoggedIn] = useState(!!token);
 
  

  // Handle login
  const handleLogin = (token, userdata) => {
    setToken(token);
    setLoggedIn(true);
    setuserdata(userdata);

    localStorage.setItem("authToken", token);
    localStorage.setItem("userdata", JSON.stringify(userdata));
  };

  // Handle logout
  const handleLogout = () => {
    setToken(null);
    setLoggedIn(false);
    setuserdata(null);

    localStorage.removeItem("authToken");
    localStorage.removeItem("userdata");
  };

  return (
    <CartProvider>
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                handleLogout={handleLogout}
                token={token}
                userdata={userdata}
              />
            }
          />
          <Route
            path="/categorypage"
            element={
              <Categorypage
                handleLogout={handleLogout}
                token={token}
                userdata={userdata}
              />
            }
          />
          <Route
            path="/productpage"
            element={
              <Productpage
                handleLogout={handleLogout}
                token={token}
                userdata={userdata}
              />
            }
          />
          <Route
            path="/viewproducts"
            element={
              <Viewproducts
                handleLogout={handleLogout}
                token={token}
                userdata={userdata}
              />
            }
          />
          <Route
            path="/login"
            element={
              loggedIn ? (
                <Navigate to="/" />
              ) : (
                <Login handleLogin={handleLogin} />
              )
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotpassword" element={<Forgotpassword />} />
          <Route path="/otp" element={<Otp />} />
          <Route
            path="/addtocart"
            element={
              <Addtocart
                handleLogout={handleLogout}
                token={token}
                userdata={userdata}
              />
            }
          />
          <Route
            path="/orders"
            element={
              <Orders
                handleLogout={handleLogout}
                token={token}
                userdata={userdata}
              />
            }
          />
          <Route
            path="/ordertracking"
            element={
              <Ordertracking
                handleLogout={handleLogout}
                token={token}
                userdata={userdata}
              />
            }
          />
          <Route
            path="/orderdetails"
            element={
              <Orderdetails
                handleLogout={handleLogout}
                token={token}
                userdata={userdata}
              />
            }
          />
          <Route
            path="/contact"
            element={
              <Contact
                handleLogout={handleLogout}
                token={token}
                userdata={userdata}
              />
            }
          />
          <Route
            path="/profile"
            element={
              loggedIn ? (
                <Profile
                  handleLogout={handleLogout}
                  token={token}
                  userdata={userdata}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
             <Route
            path="/search"
            element={
              <Search
                handleLogout={handleLogout}
                token={token}
                userdata={userdata}
              />
            }
          />
        </Routes>
      </div>
    </Router>
    </CartProvider>
  );
}

export default App;
