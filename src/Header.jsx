import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';
import  romania from './assets/romania.svg';
import  logo  from './assets/wings.png';
import './App.css';

export function Header({ user, onLogout, onLoginClick, cartCount, onCartClick, onOrdersClick }) {
  const [showMenu, setShowMenu] = React.useState(false);
  const menuRef = React.useRef();

  // Close menu on outside click
  React.useEffect(() => {
    if (!showMenu) return;
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showMenu]);

  return (
    <header className='cart' style={{
      width: '100vw',
      minHeight: 0,
      height: 'auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid',
      boxSizing: 'border-box',
      margin: 0,
      padding: '2rem 4rem'
    }}>
      <h1 style={{ margin: 0, fontSize: 36, alignContent: 'center', display: 'flex', alignItems: 'center', gap: 16, fontWeight: 700 }}>
                <img src={logo} alt="WingsMag Logo" style={{ width: 48, height: 48, borderRadius: '50%' }} />

        WINGSMAG</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, position: 'relative' }}>
        <img src={romania} alt="Romania Flag" style={{ width: 32, height: 32, borderRadius: '50%' }} />
        <button onClick={onCartClick} style={{ position: 'relative', borderRadius: 20, height: 48, padding: '12px 24px', fontWeight: 600, fontSize: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
          <FontAwesomeIcon icon={faShoppingCart} />
          {cartCount > 0 && (
            <span style={{ position: 'absolute', top: -8, right: -8, background: '#e74c3c', color: '#fff', borderRadius: '50%', padding: '4px 11px', fontSize: 16, fontWeight: 700 }}>{cartCount}</span>
          )}
        </button>
        <button
              style={{ borderRadius: '50%', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', fontSize: 20 }}
              onClick={() => setShowMenu((v) => !v)}
              aria-label="User menu"
            >
              <FontAwesomeIcon icon={faUser} />
            </button>
        {showMenu && (
          <>
            
              <div ref={menuRef} className='cart' style={{
                position: 'absolute',
                top: 60,
                right: 0,
                border: '1px solid #ccc',
                borderRadius: 8,
                boxShadow: '0 2px 12px #0002',
                minWidth: 220,
                zIndex: 100,
                padding: '1rem 0',
                display: 'flex',
                flexDirection: 'column',
                gap: 0
              }}>
                <div style={{  padding: '0.5rem 1.5rem', fontWeight: 800, borderBottom: '1px solid', marginBottom: 8 }}>
                  { user ? user.email : 'Guest account' }
                </div>
                <button
                  onClick={() => { setShowMenu(false); onOrdersClick && onOrdersClick(); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    padding: '0.75rem 1.5rem',
                    fontSize: 16,
                    cursor: 'pointer',
                    width: '100%',
                    borderBottom: '1px solid',
                  }}
                >
                  { user ? 'My Orders' : 'View Orders' }
                </button>
                {user ? (
                    <button
                    onClick={() => { setShowMenu(false); onLogout(); }}
                    style={{
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        padding: '0.75rem 1.5rem',
                        fontSize: 16,
                        cursor: 'pointer',
                        color: '#e74c3c',
                        width: '100%'
                    }}
                    >
                    Logout
                    </button>
                ) : (
                    <button onClick={() => {setShowMenu(false), onLoginClick()}} style={{
                        background: 'none',
                        border: 'none',
                        
                        padding: '0.75rem 1.5rem',
                        textAlign: 'left', fontWeight : 'bold',fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                         Login
                    </button>
                )}
                          

              </div>
          </>
        )}
      </div>
    </header>
  );
}
