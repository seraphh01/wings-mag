import React from 'react';
import { faLock, faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Cart({ cart, onUpdate, onCheckout, onClose, show }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartRef = React.useRef();

    // Close menu on outside click
    React.useEffect(() => {
      if (!show) return;
      function handleClick(e) {
        if (cartRef.current && !cartRef.current.contains(e.target)) {
          onClose();
        }
      }
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }, [show]);
  

  const handleQty = (id, qty) => {
    if (qty < 1) return;
    onUpdate(cart.map(item => item.id === id ? { ...item, qty } : item));
  };

  const handleRemove = (id) => {
    onUpdate(cart.filter(item => item.id !== id));
  };

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.4)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div
        ref={cartRef}
        className="cart"
        style={{
          minWidth: 320,
          minHeight: 200,
          maxWidth: 400,
          width: '90vw',
          border: '1px solid #ddd',
          borderRadius: 12,
          boxShadow: '0 4px 32px #0003',
          padding: 32,
          position: 'relative',
          zIndex: 2100,
        }}
      >
        <button
          onClick={onClose}
          style={{
            padding: '0px 12px',
            position: 'absolute',
            top: 12,
            right: 16,
            fontSize: 28,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#888',
            borderColor: '#888',
          }}
        >
          &times;
        </button>
        <h3 style={{ marginTop: 0, marginBottom: 20, textAlign: 'center' }}>Your Cart</h3>
        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#888' }}>No items in cart.</div>
        ) : (
          <>
            <ul style={{ listStyle: 'none', padding: 0, maxHeight: 260, overflowY: 'auto', marginBottom: 0 }}>
              {cart.map(item => (
                <li
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 12,
                    borderBottom: '1px solid #eee',
                    paddingBottom: 8,
                    gap: 16,
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', marginBottom: 4, textAlign: 'left', gap: 16 }}>
                    <img src={item.photos && item.photos.length > 0 ? item.photos[0] : 'https://via.placeholder.com/60x60?text=No+Image'} alt={item.name} style={{ width: 60, height: 60, objectFit: 'contain', borderRadius: 8, background: '#fafafa' }} />
                    <span style={{ display: 'block', marginBottom: 4, textAlign: 'left' }}>
                      <b>{item.name}</b> <br />
                      <span>Preț: RON {item.price}</span>
                    </span>
                    <span>X {item.qty} </span>
                  </span>
                  <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button style={{ padding: '0px 8px', fontSize: 16 }} onClick={() => handleQty(item.id, Math.max(0, item.qty - 1))}><FontAwesomeIcon icon={faMinus} /></button>
                    <button style={{ padding: '0px 8px', fontSize: 16 }} onClick={() => handleQty(item.id, item.qty + 1)}><FontAwesomeIcon icon={faPlus} /></button>
                    <button style={{ padding: '0px 8px', fontSize: 16 }} onClick={() => handleRemove(item.id)}><FontAwesomeIcon color="red" icon={faTrash} /></button>
                  </span>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 18, fontWeight: 'bold', textAlign: 'right' }}>Total: RON {total.toFixed(2)}</div>
            <button
              style={{
                marginTop: 24,
                width: '100%',
                padding: '12px 0',
                fontSize: 18,
                background: '#222',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
                opacity: cart.length === 0 ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
              onClick={onCheckout}
              disabled={cart.length === 0}
            >
              <FontAwesomeIcon icon={faLock} /> Plateste in siguranta
            </button>
          </>
        )}
      </div>
    </div>
  );
}
