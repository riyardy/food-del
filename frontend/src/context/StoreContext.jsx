import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [food_list, setFoodList] = useState([]);
  const url = "http://localhost:4000";
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // Fetch food list
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      setFoodList(response.data.data);
    } catch (error) {
      console.error("Failed to fetch food list:", error);
    }
  };

  // Load user's cart
  const loadCartData = async (token) => {
    try {
      const response = await axios.post(`${url}/api/cart/get`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(response.data.cartData || {});
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  };

  // Save token and load cart
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      loadCartData(token);
    } else {
      localStorage.removeItem("token");
      setCartItems({});
    }
  }, [token]);

  // Fetch food list on mount
  useEffect(() => {
    fetchFoodList();
  }, []);

  // Add item to cart
  const addToCart = async (itemId) => {
    const updatedCart = {
      ...cartItems,
      [itemId]: (cartItems[itemId] || 0) + 1,
    };
    setCartItems(updatedCart);
    if (token) {
      await axios.post(`${url}/api/cart/add`, { itemId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  };

  //  Remove item from cart
  const removeFromCart = async (itemId) => {
    const updatedCart = {
      ...cartItems,
      [itemId]: Math.max((cartItems[itemId] || 1) - 1, 0),
    };
    setCartItems(updatedCart);
    if (token) {
      await axios.post(`${url}/api/cart/remove`, { itemId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  };

  // Total cart amount
  const getTotalCartAmount = () => {
    let total = 0;
    for (let id in cartItems) {
      const product = food_list.find((item) => item._id === id);
      if (product) {
        total += product.price * cartItems[id];
      }
    }
    return total;
  };

  // Provide context to entire app
  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
