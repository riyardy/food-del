import React, { useEffect, useState } from 'react';
import './Orders.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${url}/api/order/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.success) {
        setOrders(res.data.data);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      toast.error("Error fetching orders");
    }
  };

  const markDelivered = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${url}/api/order/status`,
        { orderId, status: "Delivered" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.success) {
        toast.success("Marked as Delivered");
        fetchOrders(); // Refresh order list
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Server error while updating");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="orders add flex-col">
      <p>Customer Orders</p>
      <div className="orders-list">
        <div className="orders-header list-table-format title">
          <p>User</p>
          <p>Items</p>
          <p>Amount</p>
          <p>Status</p>
          <p>Action</p>
        </div>
        {orders.map((order, index) => (
          <div key={index} className="list-table-format">
            <p>{order.userId?.name || "User"}</p>
            <p>
              {order.items.map((item, idx) => (
                <span key={idx}>
                  {item.name} x{item.quantity}
                  <br />
                </span>
              ))}
            </p>
            <p>₹{order.amount}</p>
            <p>{order.status}</p>
            <p>
              {order.status !== "Delivered" && (
                <button
                  onClick={() => markDelivered(order._id)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "tomato",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  Mark as Delivered
                </button>
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
