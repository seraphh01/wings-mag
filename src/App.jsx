import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faRightToBracket, faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';
import AdminPanel from './AdminPanel';
import AuthForm from './AuthForm';
import ProductList from './ProductList';
import Cart from './Cart';
import CheckoutModal from './CheckoutModal';
import OrdersPanel from './OrdersPanel';
import reactLogo from './assets/react.svg';
import './App.css';
import { getOrders } from './api';
import { Header } from './Header';
import Footer from './Footer';

function App() {
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  // Add to cart handler
  const handleAddToCart = (product) => {
    setCart(prev => {
      const found = prev.find(item => item.id === product.id);
      if (found) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  // Update cart handler
  const handleUpdateCart = (newCart) => setCart(newCart);

  // Checkout handler (placeholder)
  const handleCheckout = () => {
    setShowCheckout(true);
    setShowCart(false);
  };

  const handleOrderPlaced = (order) => {
    setCart([]);
    setShowCheckout(false);
    alert('Order placed! Your order ID: ' + order.id);
  };

  const handleLogin = (token, email, is_admin) => {
    setUser({ email, token, is_admin });
    localStorage.setItem('token', token);
    localStorage.setItem('email', email);
    localStorage.setItem('is_admin', is_admin ? '1' : '0');
    setShowAuth(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('is_admin');
    setShowOrders(false);
  };

  // On mount, check for existing login
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    const is_admin = localStorage.getItem('is_admin') === '1';
    if (token && email) setUser({ email, token, is_admin });
  }, []);

  const handleOrdersClick = () => {
    setShowOrders(true);
  };


  return (
    <div>
      <Header
        user={user}
        onLogout={handleLogout}
        onLoginClick={() => setShowAuth(true)}
        cartCount={cart.reduce((sum, item) => sum + item.qty, 0)}
        onCartClick={() => setShowCart(true)}
        onOrdersClick={handleOrdersClick}
      />
      {user?.is_admin && <AdminPanel user={user} />}
      <main>
        <ProductList onAddToCart={handleAddToCart} />
        {showOrders && (
          <OrdersPanel user={user} onClose={() => setShowOrders(false)}/>
        )}
        {showCart && (
          <Cart
            cart={cart}
            onUpdate={handleUpdateCart}
            onCheckout={handleCheckout}
            onClose={() => setShowCart(false)}
            show={showCart}
          />
        )}
        {showCheckout && (
          <CheckoutModal
            cart={cart}
            user={user}
            onClose={() => setShowCheckout(false)}
            onOrderPlaced={handleOrderPlaced}
          />
        )}
      </main>
      {showAuth && (
        <div style={{
          background: 'rgba(0,0,0,0.5)',
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{  borderRadius: 8, boxShadow: '0 2px 16px #0002', minWidth: 340, position: 'relative' }}>
            <button onClick={() => setShowAuth(false)} style={{ position: 'absolute', top: 8, right: 12, fontSize: 22, background: 'none', border: 'none', cursor: 'pointer' }}>&times;</button>
            <AuthForm onLogin={handleLogin} />
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default App
