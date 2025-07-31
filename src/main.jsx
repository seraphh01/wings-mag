import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001';
export const BACKEND_BASE = API_BASE.replace(/\/api$/, '');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
