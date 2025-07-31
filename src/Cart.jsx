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
      <div ref={cartRef} className="cart" style={{ minWidth: 200, minHeight: 150, border: '1px solid', borderRadius: 8, boxShadow: '0 2px 16px #0002',  position: 'absolute', top: 90, right: 140, padding: 24 }}>
        <button onClick={onClose} style={{ padding: '0px 12px', position: 'absolute', top: 8, right: 12, fontSize: 22, background: 'none', border: 'none', cursor: 'pointer' }}>&times;</button>
        <h3>Your Cart</h3>
        {cart.length === 0 ? <div>No items in cart.</div> : (
          <>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {cart.map(item => (
                <li key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent:'space-between', marginBottom: 12, borderBottom: '1px solid #eee', paddingBottom: 8, gap: 16 }}>
                  
                  <span style={{ display: 'flex', alignItems: 'center', marginBottom: 4, textAlign: 'left', gap: 16 }}>
                    <span style={{ display: 'block', marginBottom: 4, textAlign: 'left' }}>
                    <b>{item.name}</b> <br />
                    <span>Mărime: {item.size}</span> <br />
                    <span>Preț: RON {item.price}</span>
                  </span>

                  
                  <span>X {item.qty} </span> 
                  </span>


                  <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button style={{ padding: '0px !important'}} onClick={() => handleQty(item.id, Math.max(0, item.qty - 1))}><FontAwesomeIcon icon={faMinus}/></button>
                    <button style={{ padding: '0!important'}} onClick={() => handleQty(item.id, item.qty + 1)}><FontAwesomeIcon icon={faPlus}/></button> 
                    <button onClick={() => handleRemove(item.id)}><FontAwesomeIcon color="red" icon={faTrash}/></button>
                  </span>
                  
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 12, fontWeight: 'bold' }}>Total: RON {total.toFixed(2)}</div>
            <button style={{ marginTop: 16, width: '100%' }} onClick={onCheckout} disabled={cart.length === 0}><FontAwesomeIcon icon={faLock}/> Secure Checkout</button>
          </>
        )}
      </div>
  );
}
