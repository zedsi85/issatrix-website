import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { C, FONT_SANS, FONT_MONO, FONT_DISPLAY } from '../../tokens.js';
import { apiPostNoAuth, setToken } from '../../lib/api.js';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiPostNoAuth('/api/auth/login', { password });
      setToken(data.token);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: C.ink,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      fontFamily: FONT_SANS,
    }}>
      <div style={{
        width: '100%',
        maxWidth: 380,
        background: C.paper,
        borderRadius: 8,
        padding: '40px 36px',
      }}>
        {/* Logo mark */}
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <img src="/assets/issatrix-wordmark.svg" alt="Issatrix" height={22} />
          <div style={{
            marginTop: 10,
            fontFamily: FONT_MONO,
            fontSize: 11,
            letterSpacing: '0.12em',
            color: C.slate400,
            textTransform: 'uppercase',
          }}>
            Agent Console
          </div>
        </div>

        <h1 style={{
          fontFamily: FONT_DISPLAY,
          fontSize: 22,
          fontWeight: 400,
          color: C.ink,
          margin: '0 0 6px',
        }}>
          Admin access
        </h1>
        <p style={{ fontSize: 13, color: C.slate400, margin: '0 0 28px' }}>
          Enter your admin password to continue.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: C.slate500, display: 'block', marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              style={{
                width: '100%',
                height: 40,
                padding: '0 12px',
                borderRadius: 4,
                border: `1px solid ${error ? C.halted : C.slate200}`,
                fontFamily: FONT_SANS,
                fontSize: 14,
                color: C.ink,
                background: C.bone,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <p style={{ fontSize: 13, color: C.halted, margin: '0 0 14px' }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              height: 40,
              background: loading ? C.slate300 : C.ink,
              color: C.paper,
              border: 'none',
              borderRadius: 4,
              fontFamily: FONT_SANS,
              fontSize: 14,
              fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 120ms',
            }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
