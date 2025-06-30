import React, { useState, useContext, useEffect, useRef } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const [showMenu, setShowMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { cartItems, token, setToken, getTotalCartAmount, setCartItems } = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
    navigate("/");
  };

  const totalQuantity = Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);
  const totalPrice = getTotalCartAmount();
  const [bounce, setBounce] = useState(false);
  const [showPrice, setShowPrice] = useState(true);

  useEffect(() => {
    if (totalQuantity > 0) {
      setBounce(true);
      const timeout = setTimeout(() => setBounce(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [totalQuantity]);

  useEffect(() => {
    setShowMenu(false);
    window.scrollTo(0, 0);
    if (location.pathname === '/') setMenu('home');
    else setMenu('');
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleBadgeView = () => setShowPrice(prev => !prev);

  const handleSearchKey = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      navigate(`/search?query=${searchTerm}`);
      setSearchTerm("");
      setShowSearch(false);
    }
  };

  return (
    <div className="navbar">
      <Link to='/' onClick={() => setMenu("home")}>
        <img src={assets.logo} alt="Logo" className="logo" />
      </Link>

      <ul className={`navbar-menu ${showMenu ? 'show' : ''}`}>
        <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>home</Link>
        <a href='#explore-menu' onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>menu</a>
        <a href='#app-download' onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>mobile-app</a>
        <a href='#footer' onClick={() => setMenu("contact us")} className={menu === "contact us" ? "active" : ""}>contact us</a>
      </ul>

      <div className="navbar-right">
        <div className="navbar-search-wrapper">
          <img
            src={assets.search_icon}
            alt="Search"
            title="Search"
            onClick={() => setShowSearch(!showSearch)}
            className="search-icon"
          />
          {showSearch && (
            <input
              type="text"
              placeholder="Search food..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKey}
            />
          )}
        </div>

        <div className="navbar-search-icon" onClick={toggleBadgeView} title="Click to toggle cart badge view">
          <Link to='/cart'>
            <img src={assets.basket_icon} alt="Cart" />
            {(totalQuantity > 0) && (
              <div className={`cart-count ${bounce ? 'bounce' : ''}`}>
                {showPrice ? `₹${totalPrice}` : totalQuantity}
              </div>
            )}
          </Link>
        </div>

        {!token ? (
          <button onClick={() => setShowLogin(true)}>sign in</button>
        ) : (
          <div className="navbar-profile" ref={profileRef}>
            <img src={assets.profile_icon} alt="Profile" onClick={() => setShowProfileMenu(!showProfileMenu)} />
            {showProfileMenu && (
              <ul className="nav-profile-dropdown">
                <li onClick={() => navigate("/orders")}><img src={assets.bag_icon} alt="Orders" /><p>Orders</p></li>
                <hr />
                <li onClick={logout}><img src={assets.logout_icon} alt="Logout" /><p>Logout</p></li>
              </ul>
            )}
          </div>
        )}

        <div className="hamburger" onClick={() => setShowMenu(!showMenu)} title="Menu">
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
