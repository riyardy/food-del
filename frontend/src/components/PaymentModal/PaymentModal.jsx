// src/components/PaymentModal/PaymentModal.jsx
import React from 'react';
import './PaymentModal.css';

const PaymentModal = ({ onClose, onSuccess }) => {
  const handlePayment = () => {
    // Simulate delay like real payment gateway
    setTimeout(() => {
      onSuccess();
    }, 1000);
  };

  return (
    <div className="payment-overlay">
      <div className="payment-modal">
        <h2>Fake Payment Gateway</h2>
        <input placeholder="Card Number" />
        <input placeholder="Expiry Date" />
        <input placeholder="CVV" />
        <button onClick={handlePayment}>Pay ₹500</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default PaymentModal;
