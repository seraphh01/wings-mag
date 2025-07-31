import React, { useState } from 'react';
import { placeOrder } from './api';

export default function CheckoutModal({ cart, user, onClose, onOrderPlaced }) {
  const [shipping, setShipping] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const res = await placeOrder({ user, cart, shipping_address: shipping, email: user ? user.email : email });
    setLoading(false);
    if (res.id) {
      setMessage('Order placed! Your order ID: ' + res.id);
      onOrderPlaced && onOrderPlaced(res);
    } else {
      setMessage(res.error || 'Order failed');
    }
  };

  return (
    <div  style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
    }}>
      <div className='cart' style={{  borderColor: "#fff", borderWidth: 1, borderRadius: 8, boxShadow: '0 2px 16px #fff', minWidth: 340, position: 'relative', padding: 24 }}>
        <button onClick={onClose} style={{ padding: '0px 12px', position: 'absolute', top: 8, right: 12, fontSize: 22, background: 'none', border: 'none', cursor: 'pointer' }}>&times;</button>
        <h2>Checkout</h2>
        <form onSubmit={handleSubmit}>
          {!user && (
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ width: 'calc(100% - 20px)', marginBottom: 12, padding: 8 }}
            />
          )}
          <textarea
            placeholder="Shipping address"
            value={shipping}
            onChange={e => setShipping(e.target.value)}
            required
            style={{ width: 'calc(100% - 20px)', marginBottom: 12, padding: 8, minHeight: 60 }}
          />
          <button type="submit" style={{ width: '100%', padding: 10 }} disabled={loading}>
            {loading ? 'Placing order...' : 'Place Order'}
          </button>
        </form>
        {message && <div style={{ marginTop: 16, color: message.startsWith('Order placed') ? 'green' : 'red' }}>{message}</div>}
      </div>
    </div>
  );
}
