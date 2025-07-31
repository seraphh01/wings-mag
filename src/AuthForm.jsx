import React, { useState } from 'react';
import { register, login } from './api';

export default function AuthForm({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      if (isLogin) {
        const res = await login(email, password);
        if (res.token) {
          setMessage('Login successful!');
          if (onLogin) onLogin(res.token, email, res.user?.is_admin);
        } else {
          setMessage(res.error || 'Login failed');
        }
      } else {
        if (password !== repeatPassword) {
          setMessage('Passwords do not match');
          return;
        }

        const res = await register(email, password);
        if (res.email) {
          setMessage('Registration successful! Please log in.');
          setIsLogin(true);
        } else {
          setMessage(res.error || 'Registration failed');
        }
      }
    } catch (err) {
      setMessage('Error connecting to server');
    }
  };

  return (
    <div className='cart' style={{ maxWidth: 400, padding: 24, border: '1px solid', borderRadius: 8 }}>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ width: 'calc(100% - 24px)', marginBottom: 12, padding: 8 }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ width: 'calc(100% - 24px)', marginBottom: 12, padding: 8 }}
        />
        {!isLogin && (
          <input
            type="password"
            placeholder="Repeat Password"
            value={repeatPassword}
            onChange={e => setRepeatPassword(e.target.value)}
            required
            style={{ width: 'calc(100% - 24px)', marginBottom: 12, padding: 8 }}
          />
        )}
        <button type="submit" style={{ width: '100%', padding: 10 }}>
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)} style={{ marginTop: 12, width: '100%' }}>
        {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
      </button>
      {message && <div style={{ marginTop: 16, color: 'red' }}>{message}</div>}
    </div>
  );
}
