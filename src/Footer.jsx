import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      width: '100%',
      color: '#fff',
      padding: '24px 0',
      textAlign: 'center',
      marginTop: 40,
      fontSize: 16,
      letterSpacing: 0.2,
      borderTop: '2px solid #eee',
      position: 'relative',
      bottom: 0
    }}>
      <div style={{ marginBottom: 8 }}>
        &copy; {new Date().getFullYear()} WINGSMAG. All rights reserved.
      </div>
      <div>
        Contact: <a href="mailto:contact@wingsmag.com" style={{ color: '#fff', textDecoration: 'underline' }}>contact@wingsmag.com</a>
      </div>
    </footer>
  );
}
