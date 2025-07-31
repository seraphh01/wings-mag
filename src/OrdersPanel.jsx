import React, { useState, useEffect } from 'react';
import { getOrders, trackOrder } from './api';
import { dateFormatter } from './date';
export default function  OrdersPanel({ user, onClose }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [trackId, setTrackId] = useState('');
  const [trackResult, setTrackResult] = useState(null);
  const [trackError, setTrackError] = useState('');
  const [historyEmail, setHistoryEmail] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    setOrders([]);
    const email = user ? undefined : historyEmail;
    const data = await getOrders({user, email});
    setOrders(data);
    setLoading(false);
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    setTrackResult(null);
    setTrackError('');
    if (!trackId) return;
    const res = await trackOrder(trackId);
    if (res.id) setTrackResult(res);
    else setTrackError(res.error || 'Order not found');
  };

  useEffect(() => {
    if (user) {
      const fetch = async () => {
        await fetchOrders();
      };
      fetch();
    }
  }, [user]);

  return (
    <div style={{      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
                
    <div  className='cart' style={{ overflowY: 'auto', minWidth: 600, maxHeight: 600, margin: '2rem auto', padding: 24, border: '1px solid #ccc', borderRadius: 8, position: 'relative' }}>
      <button onClick={onClose} style={{padding: '0px 12px',  position: 'absolute', top: 8, right: 12, fontSize: 22, background: 'none', border: 'none', cursor: 'pointer' }}>&times;</button>
                
      <h2>Order History</h2>
      <div style={{ marginBottom: 16 }}>
        {!user && (
          <form onSubmit={e => { e.preventDefault(); fetchOrders(); }} style={{ display: 'flex', gap: 8 }}>
            <input type="email" placeholder="Enter your email" value={historyEmail} onChange={e => setHistoryEmail(e.target.value)} required style={{ flex: 1 }} />
            <button type="submit" disabled={loading}>Show Orders</button>
          </form>
        )}
      </div>
      {loading && <div>Loading...</div>}
      {orders.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {orders.map(order => (
            <li key={order.id} style={{ borderBottom: '1px solid #eee', marginBottom: 12, paddingBottom: 8 }}>
              <b style={{fontSize: 20}}>Order #{order.id}</b> <br />
              <b>Status:</b> {order.status} <br />
              <b>Placed:</b> {dateFormatter.format(new Date(order.created_at))}
            </li>
          ))}
        </ul>
      )}
      {
        !user && (<>
        <h2 style={{ marginTop: 32 }}>Track Order</h2>
                    <form onSubmit={handleTrack} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input type="text" placeholder="Order ID" value={trackId} onChange={e => setTrackId(e.target.value)} style={{ flex: 1 }} />
        <button type="submit">Track</button>
      </form>
      
      {trackResult && (
        <div style={{  padding: 12, borderRadius: 6, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <b>Order #{trackResult.id}</b><br />
          <b>Status:</b> {trackResult.status}<br />
          <b>Date:</b> {dateFormatter.format(new Date (trackResult.created_at))}<br />
          <b>Shipping address:</b> {trackResult.shipping_address}
        </div>
      )}
      {trackError && <div style={{ color: 'red' }}>{trackError}</div>}
        </>
          
          
        )
      }


    </div>
    </div>
  );
}
