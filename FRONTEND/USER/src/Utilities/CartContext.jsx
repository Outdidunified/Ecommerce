import React, { createContext, useState, useContext } from 'react';
import axios from "axios";

// Create the CartContext
const CartContext = createContext();

// CartProvider component to wrap the app and provide context values
export const CartProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);

    const fetchCartItems = async () => {
        try {
          const token = localStorage.getItem("authToken"); // Retrieve token from local storage
          const response = await axios.get("/cart/getcart", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (Array.isArray(response.data.cart)) {
           
            const newCartCount = response.data.cart.length;
            updateCartCount(newCartCount); // Update cart count globally
          } else {
            console.error("Unexpected response format:", response.data);
            
          }
        } catch (err) {
          console.error("Error fetching cart:", err);
          
        } finally {
          console.error("closed");
        }
      };
      fetchCartItems();

  // Update cart count
  const updateCartCount = (count) => {
    setCartCount(count);
  };

  

  return (
    <CartContext.Provider value={{ cartCount, fetchCartItems }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
