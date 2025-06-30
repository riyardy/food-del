import React, { useEffect, useState, useContext } from "react";
import { StoreContext } from "../../context/StoreContext";

const Account = () => {
  const { url, token } = useContext(StoreContext);
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    coordinates: { lat: "", lng: "" },
  });

  //  Fetch user profile on load
  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch(`${url}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setForm(data.user.address || form);
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["lat", "lng"].includes(name)) {
      setForm({ ...form, coordinates: { ...form.coordinates, [name]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSave = async () => {
    const res = await fetch(`${url}/api/user/update-address`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ address: form }),
    });
    const data = await res.json();
    if (data.success) {
      alert(" Address updated");
      setEditing(false);
    } else {
      alert("❌ Failed to update address");
    }
  };

  return (
    <div className="account">
      <h2>Account Details</h2>
      {!user ? (
        <p>Loading...</p>
      ) : (
        <div className="account-details">
          <div className="address-box">
            <h3>Saved Address</h3>
            {editing ? (
              <>
                <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} />
                <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} />
                <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
                <input name="street" placeholder="Street" value={form.street} onChange={handleChange} />
                <input name="city" placeholder="City" value={form.city} onChange={handleChange} />
                <input name="state" placeholder="State" value={form.state} onChange={handleChange} />
                <input name="postalCode" placeholder="Postal Code" value={form.postalCode} onChange={handleChange} />
                <input name="lat" placeholder="Latitude" value={form.coordinates.lat} onChange={handleChange} />
                <input name="lng" placeholder="Longitude" value={form.coordinates.lng} onChange={handleChange} />
                <button onClick={handleSave}>💾 Save</button>
                <button onClick={() => setEditing(false)}>Cancel</button>
              </>
            ) : (
              <div>
                <p><b>Name:</b> {form.firstName} {form.lastName}</p>
                <p><b>Phone:</b> {form.phone}</p>
                <p><b>Street:</b> {form.street}</p>
                <p><b>City:</b> {form.city}</p>
                <p><b>State:</b> {form.state}</p>
                <p><b>Postal Code:</b> {form.postalCode}</p>
                <p><b>Coordinates:</b> {form.coordinates?.lat}, {form.coordinates?.lng}</p>
                <button onClick={() => setEditing(true)}>✏️ Edit</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
