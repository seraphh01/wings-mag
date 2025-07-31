import React, { useEffect, useState } from 'react';
import { getProducts } from './api';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function ProductList({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hovered, setHovered] = useState(null);

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
  }, []);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div style={{color: 'red'}}>{error}</div>;


  return (
    <div style={{ margin: '2rem auto' }}>
      <h2>Fancy some new equipment for your next workout?</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
        {products.map(product => (
          <div key={product.id} style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, width: 260, height: 'fit-content', position: 'relative'}}>
           {/* * Product Photos */}
            {Array.isArray(product.photos) && product.photos.length > 0 ? (
              <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                {product.photos.map((photo, idx) => (
                  <img
                    key={idx}
                    src={photo}
                    alt={product.name + ' photo ' + (idx + 1)}
                    style={{  objectFit: 'cover', borderRadius: 6, border: '1px solid #eee', height: 260 }}
                  />
                ))[0]}
              </div>
            ) : (
              <div style={{ width: '100%', height: 260, background: '#f5f5f5', borderRadius: 6, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: 24 }}>
                (Lipsa imagine)
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
            <p><b>Size:</b> {product.size}</p>
            <p><b>Price:</b> RON {product.price}</p>
            {onAddToCart && (
              <button style={{ marginTop: 8, width: '100%' }} onClick={() => onAddToCart(product)}>
                Add to Cart
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
