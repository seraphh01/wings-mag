import React, { useEffect, useState } from 'react';
import { getProducts } from './api';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cover from './assets/cover.jpg';
import './ProductList.css';

export default function ProductList({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hovered, setHovered] = useState(null);
  const [coverVisible, setCoverVisible] = useState(false);

  useEffect(() => {
    getProducts()
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load products');
        setLoading(false);
      });
      setTimeout(() => setCoverVisible(true), 100);
  }, []);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div style={{color: 'red'}}>{error}</div>;


  return (
    <div style={{ margin: '2rem auto' }}>
      {/* <h1>Bine ai venit la </h1> */}
      <img className={coverVisible ? 'cover-animate-in' : 'cover-animate-init'} src={cover} alt="Cover" style={{ width: '80%', objectFit: 'cover', borderRadius: 8, marginBottom: 24 }} />
      <h2>Ești gata să-ți îmbunătățești antrenamentele? Descoperă echipamentele noastre!</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
        {products.map(product => (
          <div key={product.id} style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, width: 260, height: 'fit-content', position: 'relative'}}>
            {/* * Poze produs */}
            {Array.isArray(product.photos) && product.photos.length > 0 ? (
              <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                {product.photos.map((photo, idx) => (
                  <img
                    key={idx}
                    src={photo}
                    alt={product.name + ' poza ' + (idx + 1)}
                    style={{  objectFit: 'cover', borderRadius: 6, border: '1px solid #eee', height: 260 }}
                  />
                ))[0]}
              </div>
            ) : (
              <div style={{ width: '100%', height: 260, background: '#f5f5f5', borderRadius: 6, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: 24 }}>
                (Fără imagine)
              </div>
            )}
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, textAlign: 'center', justifyContent: 'center' }}>
              {product.name}
              <span
                style={{ cursor: 'pointer', color: '#888', position: 'relative' }}
                onMouseEnter={() => setHovered(product.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                {hovered === product.id && (
                  <span className='cart' style={{
                    position: 'absolute',
                    left: 24,
                    top: 0,
                    color: '#fff',
                    padding: '8px 12px',
                    borderRadius: 6,
                    fontSize: 14,
                    zIndex: 10,
                    minWidth: 180,
                    boxShadow: '0 2px 8px #0002',
                    whiteSpace: 'pre-line',
                  }}>
                    {product.description.split(',').map((line, idx) => (
                      <span key={idx} style={{ display: 'block'}}>{line.trim()}</span>
                    ))}
                  </span>
                )}
              </span>
            </h3>
            <p><b>Mărime:</b> {product.size}</p>
            <p><b>Preț:</b> RON {product.price}</p>
            {onAddToCart && (
              <button style={{ marginTop: 8, width: '100%' }} onClick={() => onAddToCart(product)}>
                Adaugă în coș
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
