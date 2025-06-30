import React, { useState, useContext } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { StoreContext } from "../../context/StoreContext";
import "./Checkout.css";

const LocationPicker = ({ setLatLng }) => {
  useMapEvents({
    click(e) {
      setLatLng({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
};

const Checkout = () => {
  const { cartItems, getTotalCartAmount, food_list, url, token } = useContext(StoreContext);
  const [latLng, setLatLng] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    street: "",
    city: "",
    pincode: "",
    paymentMethod: "Cash On Delivery"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (!latLng) return alert("Please select your delivery location on the map");

    const items = cartItems;
    const amount = getTotalCartAmount();

    const address = {
      ...form,
      latitude: latLng.lat,
      longitude: latLng.lng
    };

    const res = await fetch(`${url}/api/order/place`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ address, paymentMethod: form.paymentMethod, items, amount })
    });

    const data = await res.json();
    if (data.success) {
      alert("Order placed successfully!");
      window.location.href = "/orders";
    } else {
      alert("Failed to place order");
    }
  };

  return (
    <div className="checkout">
      <h2>Delivery Details</h2>

      <div className="checkout-form">
        <input name="firstName" placeholder="First Name" onChange={handleChange} />
        <input name="lastName" placeholder="Last Name" onChange={handleChange} />
        <input name="phone" placeholder="Phone Number" onChange={handleChange} />
        <input name="street" placeholder="Street Address" onChange={handleChange} />
        <input name="city" placeholder="City" onChange={handleChange} />
        <input name="pincode" placeholder="Pincode" onChange={handleChange} />
        <select name="paymentMethod" onChange={handleChange}>
          <option value="Cash On Delivery">Cash On Delivery</option>
          <option value="Online Payment">Online Payment</option>
        </select>
      </div>

      <h3>Select Location</h3>
      <MapContainer center={[17.385044, 78.486671]} zoom={13} style={{ height: "300px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationPicker setLatLng={setLatLng} />
        {latLng && <Marker position={[latLng.lat, latLng.lng]} />}
      </MapContainer>

      {latLng && (
        <p className="selected-coords">
          Selected Location: Latitude {latLng.lat.toFixed(4)}, Longitude {latLng.lng.toFixed(4)}
        </p>
      )}

      <button className="place-order-btn" onClick={handlePlaceOrder}>Place Order</button>
    </div>
  );
};

export default Checkout;
