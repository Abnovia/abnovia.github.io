import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isAuthenticated, logout } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    try {
      login(username, password);
      setUsername('');
      setPassword('');
    } catch (error) {
      setError('Login failed. Please try again.');
    }
  };

  if (isAuthenticated) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-green-600 dark:text-green-400">
          Logged in
        </span>
        <button
          onClick={logout}
          className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="px-2 py-1 text-sm rounded border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="px-2 py-1 text-sm rounded border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
        />
        <button
          type="submit"
          className="px-3 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded"
        >
          Login
        </button>
      </form>
      {error && (
        <div className="absolute top-full left-0 mt-1 text-xs text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  );
};

export default Login;
