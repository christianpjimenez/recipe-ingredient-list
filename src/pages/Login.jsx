import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ setIsLoggedIn }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const endpoint = mode === 'login' ? 'http://localhost:5000/api/auth/login' : 'http://localhost:5000/api/auth/register';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');

      if (mode === 'login') {
        // ✅ Store token
        localStorage.setItem('token', data.token);
        setIsLoggedIn(true);

        // ✅ Redirect
        navigate('/recipes');
      } else {
        alert('Registered successfully! You can now log in.');
        setMode('login');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '1rem', border: '1px solid #ccc' }}>
      <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ display: 'block', maxwidth: '100%', marginBottom: '1rem' }}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ display: 'block', maxwidth: '100%', marginBottom: '1rem' }}
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit">{mode === 'login' ? 'Login' : 'Register'}</button>
      </form>

      <p style={{ marginTop: '2.5rem' }}>
        {mode === 'login' ? (
          <>Don't have an account?{' '}
            <button type="button" onClick={() => setMode('register')}>Register</button>
          </>
        ) : (
          <>Already have an account?{' '}
            <button type="button" onClick={() => setMode('login')}>Login</button>
          </>
        )}
      </p>
    </div>
  );
}

export default Login;
