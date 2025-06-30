import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import Orders from "./pages/Orders/Orders";
import SearchResults from "./pages/SearchResults/SearchResults";
import "./index.css";
import Checkout from "./pages/Checkout/Checkout"; 
import Account from "./pages/Account/Account";  

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="app">
      <Navbar setShowLogin={setShowLogin} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order" element={<PlaceOrder />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/checkout" element={<Checkout />} />
          <Route path="/account" element={<Account />} /> 
      </Routes>
      <Footer />
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
    </div>
  );
};

export default App;
