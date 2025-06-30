import React, { useState, useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    cartItems,
    food_list,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
  } = useContext(StoreContext);

  const navigate = useNavigate();
  const subtotal = getTotalCartAmount();
  const delivery = subtotal === 0 ? 0 : 20;

  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const applyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === "SAVE10") {
      setDiscount(0.10);
      alert("🎉 Promo Applied: 10% Discount!");
    } else if (code === "FREESHIP") {
      setDiscount(0);
      alert("🚚 Promo Applied: Free Delivery!");
    } else {
      setDiscount(0);
      alert("❌ Invalid Promo Code");
    }
  };

  const discountAmount = subtotal * discount;
  const total = subtotal + delivery - discountAmount;

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />

        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={index}>
                <div className="cart-items-title cart-items-item">
                  <img src={`${url}/images/${item.image}`} alt={item.name} />
                  <p>{item.name}</p>
                  <p>₹{item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>₹{item.price * cartItems[item._id]}</p>
                  <p className="cross" onClick={() => removeFromCart(item._id)}>X</p>
                </div>
                <hr />
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>₹{subtotal}</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>₹{delivery}</p>
          </div>
          <hr />
          {discount > 0 && (
            <>
              <div className="cart-total-details">
                <p>Discount</p>
                <p>- ₹{discountAmount.toFixed(2)}</p>
              </div>
              <hr />
            </>
          )}
          <div className="cart-total-details">
            <b>Total</b>
            <b>₹{total.toFixed(2)}</b>
          </div>

          <button
            onClick={() =>
              token ? navigate("/checkout") : alert("Please login to continue")
            }
          >
            PROCEED TO CHECKOUT
          </button>
        </div>

        <div className="cart-promocode">
          <p>If you have a promo code, enter it here</p>
          <div className="cart-promocode-input">
            <input
              type="text"
              placeholder="Promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <button onClick={applyPromo}>Apply</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
