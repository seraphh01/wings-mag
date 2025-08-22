import React, { useEffect, useState } from 'react';
import { getProducts } from './api';
import cover from './assets/cover.jpg';
import './ProductList.css';

export default function LaunchPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ width: '100%', fontFamily: 'inherit' }}>
      {/* HERO */}
      <section style={{ textAlign: 'center', padding: '60px 0', background: '#222', color: '#fff' }}>
        <img src={cover} alt="cover" style={{ width: '80%', maxWidth: 600, borderRadius: 12, marginBottom: 32 }} />
        <h1 style={{ fontSize: 40, fontWeight: 700, marginBottom: 24 }}>
          Paralele construite pentru progresul tău în calisthenics
        </h1>
        <p style={{ fontSize: 20, maxWidth: 600, margin: '0 auto 32px' }}>
          De la primele prototipuri făcute din curiozitate, până la produse profesionale accesibile pentru fiecare sportiv.
        </p>
        <a href="#produse"><button style={{ fontSize: 20, borderRadius: 16, padding: '12px 32px', background: '#fff', color: '#222', fontWeight: 600, border: 'none', boxShadow: '0 2px 8px #0002', cursor: 'pointer' }}>Vezi modelele</button></a>
      </section>

      {/* STORY */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '64px 24px' }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24 }}>Povestea noastră</h2>
        <p style={{ fontSize: 18, marginBottom: 16 }}>
          Totul a început din dorința de a economisi bani și de a avea un echipament simplu, dar eficient. Primul set l-am construit împreună cu un prieten, fără să știm exact ce facem. Am învățat, am investit în unelte profesionale și acum reușim să facem paralele de calitate înaltă, accesibile oricui.
        </p>
        <p style={{ fontSize: 18 }}>
          Fiecare model este testat pentru rezistență, stabilitate și confort, astfel încât tu să te poți concentra pe progresul tău, iar noi de calitatea echipamentului tău.
        </p>
      </section>

      {/* BENEFITS */}
      <section className='revert-cart' style={{ padding: '64px 24px' }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, textAlign: 'center', marginBottom: 48 }}>
          De ce să alegi paralelele noastre?
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center', maxWidth: 1000, margin: '0 auto' }}>
          {[
            'Ușoare și portabile – le poți lua oriunde',
            'Durabile și antiaderente – siguranță la fiecare repetare',
            'Potrivite pentru flotări, handstand și planche',
          ].map((benefit, idx) => (
            <div key={idx} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #0001', padding: 32, minWidth: 220, textAlign: 'center', fontWeight: 500, fontSize: 18 }}>
              {benefit}
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="produse" style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px' }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, textAlign: 'center', marginBottom: 48 }}>
          Alege modelul care ți se potrivește
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center' }}>
          {products.sort((a, b) => a.id - b.id).map(product => (
            <div className='revert-cart' key={product.id} style={{ justifyContent: 'space-between',borderRadius: 16, boxShadow: '0 2px 12px #0002', padding: 24, width: 300, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'transform 0.2s', cursor: 'pointer' }}>
              {Array.isArray(product.photos) && product.photos.length > 0 ? (
                <img src={product.photos[0]} alt={product.name} style={{ width: '100%', height: 180, objectFit: 'contain', borderRadius: 8, marginBottom: 16, background: '#fafafa' }} />
              ) : (
                <div style={{ width: '100%', height: 180, background: '#f5f5f5', borderRadius: 8, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: 24 }}>
                  (Fără imagine)
                </div>
              )}
              <h3 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>{product.name}</h3>
              <p style={{ color: '#666', marginBottom: 12 }}>{product.description}</p>
              <p style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>RON {product.price}</p>
              <button style={{ width: '100%', borderRadius: 12, padding: '12px 0', background: '#222', color: '#fff', fontWeight: 600, border: 'none', fontSize: 18, cursor: 'pointer' }}>Cumpără acum</button>
            </div>
          ))}
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px' }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, textAlign: 'center', marginBottom: 48 }}>
          Compară modelele
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table className='revert-cart' style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd', fontSize: 16 }}>
            <thead>
              <tr style={{ }}>
                <th style={{ border: '1px solid #ddd', padding: 12 }}>Model</th>
                <th style={{ border: '1px solid #ddd', padding: 12 }}>Stabilitate</th>
                <th style={{ border: '1px solid #ddd', padding: 12 }}>Portabilitate</th>
                <th style={{ border: '1px solid #ddd', padding: 12 }}>Înălțime</th>
                <th style={{ border: '1px solid #ddd', padding: 12 }}>Ideal pentru</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} style={{  transition: 'background 0.2s' }}>
                  <td style={{ border: '1px solid #ddd', padding: 12, fontWeight: 600 }}>{product.name}</td>
                  <td style={{ border: '1px solid #ddd', padding: 12 }}>{product.stability || '-'}</td>
                  <td style={{ border: '1px solid #ddd', padding: 12 }}>{product.portability || '-'}</td>
                  <td style={{ border: '1px solid #ddd', padding: 12 }}>{product.height || '-'}</td>
                  <td style={{ border: '1px solid #ddd', padding: 12 }}>{product.idealfor || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ textAlign: 'center', padding: '60px 0', background: '#222', color: '#fff' }}>
        <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 24 }}>
          Pregătit să îți ridici antrenamentele la nivelul următor?
        </h2>
        <a href="#produse"><button style={{ fontSize: 20, borderRadius: 16, padding: '12px 32px', background: '#fff', color: '#222', fontWeight: 600, border: 'none', boxShadow: '0 2px 8px #0002', cursor: 'pointer' }}>Vezi modelele</button></a>
      </section>
    </div>
  );
}
