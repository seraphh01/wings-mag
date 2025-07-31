// Admin: upload product photo
export async function uploadProductPhoto(productId, file, user, alt_text = '', photo_order = 0) {
  const formData = new FormData();
  formData.append('photo', file);
  if (alt_text) formData.append('alt_text', alt_text);
  if (photo_order) formData.append('photo_order', photo_order);
  let headers = {};
  if (user && user.token) headers['Authorization'] = `Bearer ${user.token}`;
  const res = await fetch(`${API_BASE}/products/${productId}/photos`, {
    method: 'POST',
    headers,
    body: formData
  });
  return res.json();
}

// Admin: list product photos
export async function getProductPhotos(productId) {
  const res = await fetch(`${API_BASE}/products/${productId}/photos`);
  return res.json();
}

// Admin: delete product photo
export async function deleteProductPhoto(photoId, user) {
  let headers = {};
  if (user && user.token) headers['Authorization'] = `Bearer ${user.token}`;
  const res = await fetch(`${API_BASE}/products/photos/${photoId}`, {
    method: 'DELETE',
    headers
  });
  return res.json();
}
// Admin: add product
export async function addProduct(data, user) {
  let headers = { 'Content-Type': 'application/json' };
  if (user && user.token) headers['Authorization'] = `Bearer ${user.token}`;
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  });
  return res.json();
}
// --- Advanced analytics ---
export async function getAnalyticsSummary(user) {
  let headers = {};
  if (user && user.token) headers['Authorization'] = `Bearer ${user.token}`;
  const res = await fetch(`${API_BASE}/analytics/summary`, { headers });
  return res.json();
}
export async function getSalesByProduct(user) {
  let headers = {};
  if (user && user.token) headers['Authorization'] = `Bearer ${user.token}`;
  const res = await fetch(`${API_BASE}/analytics/sales-by-product`, { headers });
  return res.json();
}
export async function getSalesOverTime(interval = 'day', user) {
  let headers = {};
  if (user && user.token) headers['Authorization'] = `Bearer ${user.token}`;
  const res = await fetch(`${API_BASE}/analytics/sales-over-time?interval=${interval}`, { headers });
  return res.json();
}
export async function getLowInventory(threshold = 5, user) {
  let headers = {};
  if (user && user.token) headers['Authorization'] = `Bearer ${user.token}`;
  const res = await fetch(`${API_BASE}/analytics/low-inventory?threshold=${threshold}`, { headers });
  return res.json();
}
// Admin: update product (inventory, price, etc)
export async function updateProduct(id, data, user) {
  let headers = { 'Content-Type': 'application/json' };
  if (user && user.token) headers['Authorization'] = `Bearer ${user.token}`;
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data)
  });
  return res.json();
}

// Admin: delete product
export async function deleteProduct(id, user) {
  let headers = {};
  if (user && user.token) headers['Authorization'] = `Bearer ${user.token}`;
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE',
    headers
  });
  return res.json();
}

export async function deleteOrder(id, user) {
  let headers = {};
  if (user && user.token) headers['Authorization'] = `Bearer ${user.token}`;
  const res = await fetch(`${API_BASE}/orders/${id}`, { 
    method: 'DELETE',
    headers
  });
  return res.json();
}

// Admin: update order status
export async function updateOrderStatus(id, status, user) {
  let headers = { 'Content-Type': 'application/json' };
  if (user && user.token) headers['Authorization'] = `Bearer ${user.token}`;
  const res = await fetch(`${API_BASE}/orders/${id}/status`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ status })
  });
  return res.json();
}

// Helper to decode JWT (without verifying signature)
function decodeJWT(token) {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
}

export async function getOrders({ user, email, admin }) {
  let url = `${API_BASE}/orders`;
  let headers = {};
  if (user && user.token) headers['Authorization'] = `Bearer ${user.token}`;
  if (admin) {
    // Admin: no query needed, backend will return all
  } else if (user && user.email) {
    // User: backend will use token to get email
  } else if (email) {
    url += `?email=${encodeURIComponent(email)}`;
  } else {
    return [];
  }
  const res = await fetch(url, { headers });
  return res.json();
}

export async function trackOrder(orderId, user) {
  let headers = {};
  if (user && user.token) headers['Authorization'] = `Bearer ${user.token}`;
  const res = await fetch(`${API_BASE}/orders/${orderId}`, { headers });
  return res.json();
}
export async function placeOrder({ user, cart, shipping_address, email }) {
  const items = cart.map(item => ({ product_id: item.id, quantity: item.qty }));
  const body = {
    items,
    shipping_address,
    email: user?.email || email,
  };
  let headers = { 'Content-Type': 'application/json' };
  if (user && user.token) headers['Authorization'] = `Bearer ${user.token}`;
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });
  return res.json();
}
// src/api.js
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001/api';

export async function register(email, password) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

export async function getProducts() {
  try {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}
