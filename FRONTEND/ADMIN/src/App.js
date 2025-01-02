import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './Pages/Auth/login';
import Register from './Pages/Auth/Register';
import Dashboard from './Pages/Dashboard';
import Viewproduct from './Pages/Products/Viewproduct';
import Addproduct from './Pages/Products/Addproduct';
import ViewCategory from './Pages/Category/ViewCategory';
import Addcategory from './Pages/Category/Addcategory';
import Allusers from './Pages/Users/Allusers';
import Adduser from './Pages/Users/adduser';
import Allrole from './Pages/Roles/Allrole';
import Profilesetting from './Pages/Settings/Profilesetting';
import Orderdetail from './Pages/Orders/Orderdetail';
import Orderlist from './Pages/Orders/Orderlist';
import Ordertracking from './Pages/Orders/Ordertracking';
import SubCategory from './Pages/Category/SubCategory';

function App() {
    // State for token and admin data
    const [token, setToken] = useState(null);
    const [adminData, setAdminData] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);

    // Initialize state from session storage
    useEffect(() => {
        const storedToken = sessionStorage.getItem('authToken');
        console.log('token:', storedToken); // This logs the token to the console
    
        const storedAdminData = sessionStorage.getItem('adminData');
    
        if (storedToken) {
            setToken(storedToken);
            setLoggedIn(true);
            if (storedAdminData) {
                try {
                    setAdminData(JSON.parse(storedAdminData));
                } catch (error) {
                    console.error("Error parsing admin data:", error);
                }
            }
        }
    }, []);
    

    // Handle login
    const handleLogin = (token, adminData) => {
        setToken(token);
        setLoggedIn(true);
        setAdminData(adminData);

        sessionStorage.setItem('authToken', token);
        alert(token);
        sessionStorage.setItem('adminData', JSON.stringify(adminData));
    };

    // Handle logout
    const handleLogout = () => {
        setToken(null);
        setLoggedIn(false);
        setAdminData(null);
        alert(token);

        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('adminData');
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        loggedIn ? (
                            <Navigate to="/dashboard" />
                        ) : (
                            <Login handleLogin={handleLogin} />
                        )
                    }
                />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/dashboard"
                    element={
                        loggedIn ? (
                            <Dashboard handleLogout={handleLogout} token={token} adminData={adminData} />
                        ) : (
                            <Navigate to="/" />
                        )
                    }
                />
                <Route
                    path="/viewproduct"
                    element={
                        loggedIn ? (
                            <Viewproduct handleLogout={handleLogout} adminData={adminData} />
                        ) : (
                            <Navigate to="/" />
                        )
                    }
                />
                <Route
                    path="/addproduct"
                    element={
                        loggedIn ? (
                            <Addproduct handleLogout={handleLogout} adminData={adminData} />
                        ) : (
                            <Navigate to="/" />
                        )
                    }
                />
                <Route
                    path="/viewcategory"
                    element={
                        loggedIn ? (
                            <ViewCategory handleLogout={handleLogout} adminData={adminData} />
                        ) : (
                            <Navigate to="/" />
                        )
                    }
                />
                <Route
                    path="/SubCategory"
                    element={
                        loggedIn ? (
                            <SubCategory handleLogout={handleLogout} adminData={adminData} />
                        ) : (
                            <Navigate to="/" />
                        )
                    }
                />
                <Route
                    path="/addcategory"
                    element={
                        loggedIn ? (
                            <Addcategory handleLogout={handleLogout} adminData={adminData} />
                        ) : (
                            <Navigate to="/" />
                        )
                    }
                />
                <Route
                    path="/allusers"
                    element={
                        loggedIn ? (
                            <Allusers handleLogout={handleLogout} adminData={adminData} />
                        ) : (
                            <Navigate to="/" />
                        )
                    }
                />
                <Route
                    path="/adduser"
                    element={
                        loggedIn ? (
                            <Adduser handleLogout={handleLogout} adminData={adminData} />
                        ) : (
                            <Navigate to="/" />
                        )
                    }
                />
                <Route
                    path="/allrole"
                    element={
                        loggedIn ? (
                            <Allrole handleLogout={handleLogout} token={token} adminData={adminData} />
                        ) : (
                            <Navigate to="/" />
                        )
                    }
                />
                <Route
                    path="/profilesetting"
                    element={
                        loggedIn ? (
                            <Profilesetting handleLogout={handleLogout} adminData={adminData}  />
                        ) : (
                            <Navigate to="/" />
                        )
                    }
                />
                <Route
                    path="/orderdetail"
                    element={
                        loggedIn ? (
                            <Orderdetail handleLogout={handleLogout} adminData={adminData} />
                        ) : (
                            <Navigate to="/" />
                        )
                    }
                />
                <Route
                    path="/orderlist"
                    element={
                        loggedIn ? (
                            <Orderlist handleLogout={handleLogout} adminData={adminData} />
                        ) : (
                            <Navigate to="/" />
                        )
                    }
                />
                <Route
                    path="/ordertracking"
                    element={
                        loggedIn ? (
                            <Ordertracking handleLogout={handleLogout} adminData={adminData} />
                        ) : (
                            <Navigate to="/" />
                        )
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;