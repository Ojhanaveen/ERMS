import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

  try {
  const response = await axios.post('http://localhost:5000/api/auth/login', {
    email,
    password,
  });

  const { token, user } = response.data;

  login(user, token); // Store in AuthContext
  alert('Login successful!');

  // ✅ Redirect based on role
if (user.role === 'manager') {
  navigate('/dashboard'); // Or '/dashboard/manager' if you split them
} else if (user.role === 'engineer') {
  navigate('/dashboard/engineers');
} else {
  navigate('/');
}


} catch (err) {
  if (err.response?.data?.message) {
    setError(err.response.data.message);
  } else {
    setError('Login failed. Please try again.');
  }
}

  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl mb-6 text-center font-semibold">Login</h2>

        {error && (
          <div className="mb-4 text-red-600 text-center">{error}</div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full p-2 border mb-4 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full p-2 border mb-6 rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}
