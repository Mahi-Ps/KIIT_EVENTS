import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './Login.css';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${BASE}/api/auth`;

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill all fields');
      return;
    }

    if (isRegister && !role) {
      setError('Please select a role');
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        const res = await fetch(`${API_URL}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, role }),
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Registration failed');
          setLoading(false);
          return;
        }

        localStorage.setItem('user', JSON.stringify(data.user));
        navigateByRole(data.user.role);
      } else {
        const res = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Login failed');
          setLoading(false);
          return;
        }

        localStorage.setItem('user', JSON.stringify(data.user));
        navigateByRole(data.user.role);
      }
    } catch (err) {
      setError('Server not reachable');
      setLoading(false);
    }
  };

  const navigateByRole = (userRole) => {
    const routes = { student: '/student', admin: '/admin', society: '/society' };
    navigate(routes[userRole]);
  };

  return (
    <div className="login-page">
      <div className="login-bg-pattern"></div>

      <button className="login-theme-toggle" onClick={toggleTheme} title="Toggle theme">
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <span className="login-logo-icon">🎓</span>
          </div>
          <h1>KIIT Events</h1>
          <p>{isRegister ? 'Create your account' : 'Welcome back! Sign in to continue'}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="login-error">
              <span>⚠</span> {error}
            </div>
          )}

          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="you@kiit.ac.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {isRegister && (
            <div className="input-group">
              <label htmlFor="role">Register As</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="" disabled>Select your role</option>
                <option value="student">Student</option>
                <option value="admin">Admin / Faculty</option>
                <option value="society">Society</option>
              </select>
            </div>
          )}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading && <span className="spinner spinner-sm"></span>}
            {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="login-divider">
          <span>or</span>
        </div>

        <div className="login-toggle">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            className="login-toggle-btn"
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
          >
            {isRegister ? 'Sign In' : 'Create one'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
