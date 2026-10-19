
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { user, login } = useAuth();
  const navigate = useNavigate();

  // Already logged in? Redirect to the correct dashboard.
  if (user) {
    return (
      <Navigate
        to={user.role === 'admin' ? '/dashboard' : '/user-dashboard'}
        replace
      />
    );
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const success = login(email, password);

    if (!success) {
      setError('Invalid email or password.');
      return;
    }

    const loggedInUser = JSON.parse(
      localStorage.getItem('demoUser')
    );

    navigate(
      loggedInUser.role === 'admin'
        ? '/dashboard'
        : '/user-dashboard',
      { replace: true }
    );
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>My Admin</h1>
        <p className="login-subtitle">
          Sign in to access your dashboard
        </p>

        {error && (
          <p className="login-error" role="alert">
            {error}
          </p>
        )}

        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="username"
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
        />

        <button className="login-button" type="submit">
          Login
        </button>

      </form>
    </div>
  );
}
