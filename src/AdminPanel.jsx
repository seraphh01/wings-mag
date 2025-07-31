import React, { useEffect, useState } from 'react';
import { getProducts, getOrders, updateProduct, deleteProduct, updateOrderStatus, getSalesByProduct, getSalesOverTime, getLowInventory, addProduct, trackOrder, uploadProductPhoto, getProductPhotos, deleteProductPhoto, deleteOrder } from './api';
import { dateFormatter} from './date';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen, faCancel, faCircleInfo, faEdit, faFolderOpen, faSave, faSignOut, faTrash } from '@fortawesome/free-solid-svg-icons';
const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];


export default function AdminPanel({ user }) {
  // Photo management state
  const [photoModalProduct, setPhotoModalProduct] = useState(null);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [photoList, setPhotoList] = useState([]);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoError, setPhotoError] = useState('');

  // Open photo manager for a product
  const openPhotoManager = async (product) => {
    setPhotoModalProduct(product);
    setPhotoLoading(true);
    setPhotoError('');
    try {
      const photos = await getProductPhotos(product.id);
      setPhotoList(photos);
    } catch (e) {
      setPhotoError('Failed to load photos');
    }
    setPhotoLoading(false);
  };
  const closePhotoManager = () => {
    setPhotoModalProduct(null);
    setPhotoFiles([]);
    setPhotoList([]);
    setPhotoError('');
  };
  // Upload photo(s)
  const handlePhotoUpload = async (e) => {
    e.preventDefault();
    if (!photoFiles.length) return;
    setPhotoLoading(true);
    setPhotoError('');
    try {
      for (let i = 0; i < photoFiles.length; i++) {
        await uploadProductPhoto(photoModalProduct.id, photoFiles[i], user);
      }
      const photos = await getProductPhotos(photoModalProduct.id);
      setPhotoList(photos);
      setPhotoFiles([]);
    } catch (e) {
      setPhotoError('Failed to upload photo(s)');
    }
    setPhotoLoading(false);
  };
  // Delete photo
  const handleDeletePhoto = async (photoId) => {
    setPhotoLoading(true);
    setPhotoError('');
    try {
      await deleteProductPhoto(photoId, user);
      const photos = await getProductPhotos(photoModalProduct.id);
      setPhotoList(photos);
    } catch (e) {
      setPhotoError('Failed to delete photo');
    }
    setPhotoLoading(false);
  };

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editProductId, setEditProductId] = useState(null);
  const [editProduct, setEditProduct] = useState({});
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', size: '', inventory: '' });
  const [orderDetails, setOrderDetails] = useState(null);
  const [orderDetailsLoading, setOrderDetailsLoading] = useState(false);
  const [orderDetailsError, setOrderDetailsError] = useState("");
  const openOrderDetails = async (orderId) => {
    setOrderDetailsLoading(true);
    setOrderDetailsError("");
    try {
      const details = await trackOrder(orderId, user);
      setOrderDetails(details);
    } catch (e) {
      setOrderDetailsError("Failed to load order details");
    }
    setOrderDetailsLoading(false);
  };
  const closeOrderDetails = () => setOrderDetails(null);

  // Add new product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addProduct({
        name: newProduct.name,
        description: newProduct.description,
        price: Number(newProduct.price),
        size: newProduct.size,
        inventory: Number(newProduct.inventory)
      }, user);
      setNewProduct({ name: '', description: '', price: '', size: '', inventory: '' });
      await fetchProducts();
    } catch (e) {
      setError('Failed to add product');
    }
    setLoading(false);
  };
  const [editOrderId, setEditOrderId] = useState(null);
  const [editOrderStatus, setEditOrderStatus] = useState('');

  // Fetch all products
  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (e) {
      setError('Failed to load products');
    }
    setLoading(false);
  };

  // Edit product handlers
  const startEditProduct = (p) => {
    setEditProductId(p.id);
    setEditProduct({ name: p.name, price: p.price, inventory: p.inventory, size: p.size, description: p.description });
  };
  const cancelEditProduct = () => {
    setEditProductId(null);
    setEditProduct({});
  };
  const saveEditProduct = async (id) => {
    setLoading(true);
    await updateProduct(id, editProduct, user);
    await fetchProducts();
    setEditProductId(null);
    setEditProduct({});
    setLoading(false);
  };
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    setLoading(true);
    await deleteProduct(id, user);
    await fetchProducts();
    setLoading(false);
  };

    const handleDeleteOrder = async (id) => {
    if (!window.confirm('Delete this order?')) return;
    setLoading(true);
    await deleteOrder(id, user);
    setOrders(orders.filter(o => o.id !== id));
    setLoading(false);
  };


  // Fetch all orders
  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      let data;
      if (user && user.is_admin) {
        data = await getOrders({ user, admin: true });
      } else {
        data = await getOrders({ user });
      }
      setOrders(data);
    } catch (e) {
      setError('Failed to load orders');
    }
    setLoading(false);
  };

  // Analytics state
  const [analytics, setAnalytics] = useState({ totalSales: 0, totalOrders: 0, totalProducts: 0, totalInventory: 0 });
  const [salesByProduct, setSalesByProduct] = useState([]);
  const [salesOverTime, setSalesOverTime] = useState([]);
  const [lowInventory, setLowInventory] = useState([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // Compute analytics from orders/products
  useEffect(() => {
    if (user?.is_admin) {
      fetchProducts();
      fetchOrders();
    }
  }, [user]);

  useEffect(() => {
    // Compute analytics when orders/products change
    let totalSales = 0;
    let totalOrders = orders.length;
    let totalProducts = products.length;
    let totalInventory = products.reduce((sum, p) => sum + (Number(p.inventory) || 0), 0);
    if (orders.length && products.length) {
      const avgPrice = products.reduce((sum, p) => sum + Number(p.price), 0) / products.length;
      totalSales = Math.round(avgPrice * orders.length * 100) / 100;
    }
    setAnalytics({ totalSales, totalOrders, totalProducts, totalInventory });
  }, [orders, products]);

  // Advanced analytics fetch
  useEffect(() => {
    if (!user?.is_admin) return;
    setAnalyticsLoading(true);
    Promise.all([
      getSalesByProduct(user).then(setSalesByProduct),
      getSalesOverTime('month', user).then(setSalesOverTime),
      getLowInventory(5, user).then(setLowInventory)
    ]).finally(() => setAnalyticsLoading(false));
  }, [user, orders, products]);

  if (!user?.is_admin) return null;

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', padding: 24, border: '2px solid #bada55', borderRadius: 10 }}>
      <h2>Admin Panel</h2>
      <section style={{ marginBottom: 24, padding: 16, borderRadius: 8, border: '1px solid #e0e0b0', display: 'flex', gap: 32 }}>
        <div><b>Total Sales:</b><br />RON {analytics.totalSales}</div>
        <div><b>Total Orders:</b><br />{analytics.totalOrders}</div>
        <div><b>Total Products:</b><br />{analytics.totalProducts}</div>
        <div><b>Total Inventory:</b><br />{analytics.totalInventory}</div>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h3>Sales by Product</h3>
        {analyticsLoading ? <div>Loading...</div> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr><th>Product</th><th>Units Sold</th><th>Revenue</th></tr>
            </thead>
            <tbody>
              {salesByProduct.map(row => (
                <tr key={row.id}>
                  <td>{row.name}</td>
                  <td>{row.units_sold}</td>
                  <td>RON {Number(row.revenue).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section style={{ marginBottom: 32 }}>
        <h3>Sales Over Time (Monthly)</h3>
        {analyticsLoading ? <div>Loading...</div> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr><th>Month</th><th>Revenue</th></tr>
            </thead>
            <tbody>
              {salesOverTime.map(row => (
                <tr key={row.period}>
                  <td>{row.period?.slice(0, 7)}</td>
                  <td>RON {Number(row.revenue).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section style={{ marginBottom: 32 }}>
        <h3>Low Inventory Products (≤5)</h3>
        {analyticsLoading ? <div>Loading...</div> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr><th>Product</th><th>Inventory</th></tr>
            </thead>
            <tbody>
              {lowInventory.map(row => (
                <tr key={row.id}>
                  <td>{row.name}</td>
                  <td>{row.inventory}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <section style={{ marginBottom: 32 }}>
        <h3>Products</h3>
        <form onSubmit={handleAddProduct} style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <input required placeholder="Name" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
          <input required placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
          <input required placeholder="Size" value={newProduct.size} onChange={e => setNewProduct({ ...newProduct, size: e.target.value })} style={{ width: 80 }} />
          <input required type="number" placeholder="Price" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} style={{ width: 80 }} />
          <input required type="number" placeholder="Inventory" value={newProduct.inventory} onChange={e => setNewProduct({ ...newProduct, inventory: e.target.value })} style={{ width: 80 }} />
          <button type="submit">Add Product</button>
        </form>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Inventory</th><th>Price</th><th>Photos</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>
                  {editProductId === p.id ? (
                    <input value={editProduct.name} onChange={e => setEditProduct({ ...editProduct, name: e.target.value })} />
                  ) : p.name}
                </td>
                <td>
                  {editProductId === p.id ? (
                    <input type="number" value={editProduct.inventory} onChange={e => setEditProduct({ ...editProduct, inventory: e.target.value })} style={{ width: 60 }} />
                  ) : p.inventory}
                </td>
                <td>
                  {editProductId === p.id ? (
                    <input type="number" value={editProduct.price} onChange={e => setEditProduct({ ...editProduct, price: e.target.value })} style={{ width: 80 }} />
                  ) : `${p.price}`}
                </td>
                <td>
                  <button onClick={() => openPhotoManager(p)} style={{ fontSize: 13 }}>Manage Photos</button>
                </td>
                <td style={{ display: 'flex', gap: 8 }}>
                  {editProductId === p.id ? (
                    <>
                      <button onClick={() => saveEditProduct(p.id)}><FontAwesomeIcon icon={faSave}/></button>
                      <button onClick={cancelEditProduct}><FontAwesomeIcon icon={faCancel}/></button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEditProduct(p)}><FontAwesomeIcon icon={faEdit}/></button>
                      <button onClick={() => handleDeleteProduct(p.id)} style={{ color: 'red' }}><FontAwesomeIcon icon={faTrash}/></button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            
          </tbody>
          
        </table>
        
      </section>
      {/* Photo management modal */}
      {photoModalProduct && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000
        }}>
          <div className='cart' style={{ borderRadius: 8, minWidth: 340, minHeight: 200, position: 'relative', padding: 24, maxWidth: 500, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <button onClick={closePhotoManager} style={{ position: 'absolute', top: 8, right: 12, fontSize: 22, background: 'none', border: 'none', cursor: 'pointer' }}>&times;</button>
            <h2>Manage Photos for: {photoModalProduct.name}</h2>
            {photoLoading && <div>Loading...</div>}
            {photoError && <div style={{ color: 'red' }}>{photoError}</div>}
            <div style={{ marginBottom: 12 }}>
              <b>Current Photos:</b>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                {photoList.length === 0 && <span style={{ color: '#aaa' }}>(No photos)</span>}
                {photoList.map(photo => (
                  <div key={photo.id} style={{ position: 'relative', display: 'inline-block' }}>
                    <img src={photo.url} alt={photo.alt_text || ''} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 6, border: '1px solid #eee' }} />
                    <button onClick={() => handleDeletePhoto(photo.id)} style={{ position: 'absolute', top: 2, right: 2, background: '#fff', border: 'none', color: 'red', fontWeight: 'bold', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', boxShadow: '0 1px 4px #0002' }}>&times;</button>
                  </div>
                ))}
              </div>
            </div>
            <form onSubmit={handlePhotoUpload} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input type="file" accept="image/*" multiple onChange={e => setPhotoFiles(Array.from(e.target.files))} />
              <button type="submit" disabled={photoLoading || !photoFiles.length}>Upload</button>
            </form>
          </div>
        </div>
      )}
      <section>
        <h3>Orders</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th><th>User</th><th>Status</th><th>Placed</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.email}</td>
                <td>
                  {o.status}
                </td>
                <td>{dateFormatter.format(new Date(o.created_at))}</td>
                <td>
                  <button onClick={() => openOrderDetails(o.id)} style={{ fontSize: 14, padding: '4px 10px' }}><FontAwesomeIcon icon={faEdit}/></button>
                </td>
                                <td>
                  <button onClick={() => handleDeleteOrder(o.id)} style={{ fontSize: 14, padding: '4px 10px' }}><FontAwesomeIcon style={{color: 'red'}} icon={faTrash}/></button>
                </td>
                </tr>
            ))}
          </tbody>
      {orderDetails && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000
        }}>
          <div className='cart' style={{  borderRadius: 8, minWidth: 340, minHeight: 200, position: 'relative', padding: 24, maxWidth: 500, justifyContent: 'start', alignItems: 'center', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <button onClick={closeOrderDetails} style={{ position: 'absolute', top: 8, right: 12, fontSize: 22, background: 'none', border: 'none', cursor: 'pointer' }}>&times;</button>
            <h2>Order #{orderDetails.id}</h2>
            <div><b>Status:</b> 
              <select value={orderDetails.status} onChange={async e => {
                const newStatus = e.target.value;
                setOrderDetails({ ...orderDetails, status: newStatus });
                setOrderDetailsLoading(true);
                await updateOrderStatus(orderDetails.id, newStatus, user);
                await fetchOrders();
                setOrderDetailsLoading(false);
              }} style={{ marginLeft: 8 }}>
                {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div style={{alignContent: 'start'}}><b>Placed:</b> {dateFormatter.format(new Date(orderDetails.created_at))}</div>
            <div><b>Shipping address:</b> {orderDetails.shipping_address}</div>
            <div style={{ marginTop: 16 }}>
              <b>Products:</b>
              {orderDetails.items ? (
                <ul>
                  {orderDetails.items.map(item => (
                    <li key={item.product_id}>
                      {item.name} → {item.quantity} &times; RON {Number(item.price).toFixed(2)}  
                    </li>
                  ))}
                </ul>
              ) : <div>Product details not available.</div>}
            </div>
            <div style={{ marginTop: 16 }}>
              <b>Total:</b> RON {Number(orderDetails.items.reduce((total, item) => total + item.quantity * item.price, 0)).toFixed(2)}
            </div>
            {orderDetailsLoading && <div>Updating...</div>}
            {orderDetailsError && <div style={{ color: 'red' }}>{orderDetailsError}</div>}
          </div>
        </div>
      )}
                
        </table>
      </section>
    </div>
  );
}
