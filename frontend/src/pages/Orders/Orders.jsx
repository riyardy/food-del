import React, { useEffect, useState, useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./Orders.css";

const Orders = () => {
  const { token, url, setCartItems, cartItems } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${url}/api/order/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders);
        } else {
          alert(data.message || "Failed to fetch orders");
        }
      } catch (error) {
        alert("Error fetching orders");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchOrders();
  }, [token, url]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      const res = await fetch(`${url}/api/order/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Order cancelled successfully");
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: "Cancelled" } : o))
        );
      } else {
        alert(data.message || "Failed to cancel order");
      }
    } catch (error) {
      alert("Error cancelling order");
    }
  };

  const handleReorder = (order) => {
    const newCart = { ...cartItems };
    order.items.forEach((item) => {
      if (newCart[item.foodId]) {
        newCart[item.foodId] += item.quantity;
      } else {
        newCart[item.foodId] = item.quantity;
      }
    });
    setCartItems(newCart);
    alert("Items added to your cart!");
  };

  if (loading) return <p>Loading your orders...</p>;
  if (!orders.length)
    return (
      <p className="empty-orders">
        Your Orders <br /> No orders yet. Start eating delicious food! 🍕
      </p>
    );

  return (
    <div className="orders-page">
      <h2>Your Orders</h2>
      {orders.map((order) => (
        <div className="order-card" key={order._id}>
          <p>
            <strong>Order Date:</strong>{" "}
            {new Date(order.date).toLocaleString()}
          </p>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
          <p>
            <strong>Payment:</strong> {order.payment ? "Paid" : "Pending"}
          </p>
          <p>
            <strong>Amount:</strong> ₹{order.amount.toFixed(2)}
          </p>

          <div className="order-items">
            {order.items && order.items.length > 0 ? (
              order.items.map((item) => (
                <div className="order-item" key={item.foodId}>
                  <img
                    src={`${url}/images/${item.image}`}
                    alt={item.name}
                    className="order-item-image"
                  />
                  <div>
                    <p>
                      <strong>{item.name}</strong>
                    </p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ₹{item.price.toFixed(2)}</p>
                    <p>Total: ₹{item.total.toFixed(2)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No items found in this order.</p>
            )}
          </div>

          <div className="order-actions">
            {(order.status !== "Cancelled" && order.status !== "Paid") && (
              <button
                className="cancel-btn"
                onClick={() => handleCancelOrder(order._id)}
              >
                Cancel Order
              </button>
            )}

            {order.items.length > 0 && order.status !== "Cancelled" && (
              <button
                className="reorder-btn"
                onClick={() => handleReorder(order)}
              >
                Reorder
              </button>
            )}
          </div>

          <hr />
        </div>
      ))}
    </div>
  );
};

export default Orders;
