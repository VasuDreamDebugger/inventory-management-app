import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authApi from '../../api/authApi';
import '../../styles/auth.css';

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (mode === 'login') {
        await authApi.login({
          email: form.email,
          password: form.password,
        });
        navigate('/');
      } else {
        if (!form.name.trim()) {
          setError('Name is required for registration');
          setLoading(false);
          return;
        }
        await authApi.register(form);
        setSuccess('Account created! Redirecting to dashboard...');
        navigate('/');
      }
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.errors?.[0]?.msg ||
        'Unable to complete request';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'register' : 'login'));
    setError('');
    setSuccess('');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>{mode === 'login' ? 'Login' : 'Create Account'}</h2>
        <p>
          {mode === 'login'
            ? 'Enter your credentials to access inventory.'
            : 'Fill the details to get started.'}
        </p>
        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <label htmlFor="name">
              <span>Full Name</span>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Jane Doe"
                value={form.name}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </label>
          )}
          <label htmlFor="email">
            <span>Email</span>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </label>
          <label htmlFor="password">
            <span>Password</span>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="******"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
              required
              minLength={6}
            />
          </label>
          {error && <div className="auth-alert error">{error}</div>}
          {success && <div className="auth-alert success">{success}</div>}
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>
        <button type="button" className="toggle-btn" onClick={toggleMode}>
          {mode === 'login'
            ? "Don't have an account? Register"
            : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
}

export default LoginPage;

