import React, { useContext, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const {
    cartItems,
    getTotalCartAmount,
    url,
    token,
    setCartItems,
  } = useContext(StoreContext);

  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
    paymentMethod: 'Cash on Delivery',
  });

  const navigate = useNavigate();

  const onChangeHandler = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    const filteredItems = {};
    for (let id in cartItems) {
      if (cartItems[id] > 0) {
        filteredItems[id] = cartItems[id];
      }
    }

    const orderData = {
      address: {
        name: data.firstName + ' ' + data.lastName,
        email: data.email,
        street: data.street,
        city: data.city,
        state: data.state,
        pincode: data.zipCode,
        country: data.country,
        phone: data.phone,
      },
      paymentMethod: data.paymentMethod,
      items: filteredItems,
      amount:
        getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2, // + delivery
    };

    try {
      const res = await fetch(`${url}/api/order/place`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const result = await res.json();
      if (result.success) {
        alert('Order placed successfully!');
        setCartItems({});
        navigate('/orders');
      } else {
        alert(result.message || 'Order failed');
      }
    } catch (err) {
      alert('Error placing order');
    }
  };

  return (
    <div>
      <form className="place-order" onSubmit={handlePlaceOrder}>
        <div className="place-order-left">
          <p className="title">Delivery Information</p>
          <div className="multi-fields">
            <input type="text" name="firstName" placeholder="First name" onChange={onChangeHandler} required />
            <input type="text" name="lastName" placeholder="Last name" onChange={onChangeHandler} required />
          </div>
          <input type="email" name="email" placeholder="Email address" onChange={onChangeHandler} required />
          <input type="text" name="street" placeholder="Street" onChange={onChangeHandler} required />
          <div className="multi-fields">
            <input type="text" name="city" placeholder="City" onChange={onChangeHandler} required />
            <input type="text" name="state" placeholder="State" onChange={onChangeHandler} required />
          </div>
          <div className="multi-fields">
            <input type="text" name="zipCode" placeholder="Zip code" onChange={onChangeHandler} required />
            <input type="text" name="country" placeholder="Country" onChange={onChangeHandler} required />
          </div>
          <input type="text" name="phone" placeholder="Phone" onChange={onChangeHandler} required />
        </div>

        <div className="place-order-right">
          <div className="cart-total">
            <h2>Cart Totals</h2>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
            </div>
            <button type="submit">PROCEED TO PAYMENT</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PlaceOrder;
