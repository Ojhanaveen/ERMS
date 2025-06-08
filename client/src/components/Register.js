import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'engineer', // default role
    skills: '',
    seniority: 'junior',
    maxCapacity: 100,
    department: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'maxCapacity' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const skillsArray = form.skills
      ? form.skills.split(',').map(skill => skill.trim())
      : [];

    const payload = { ...form, skills: skillsArray };

    if (form.role === 'manager') {
      delete payload.skills;
      delete payload.seniority;
      delete payload.maxCapacity;
    }

try {
  const res = await axios.post('/auth/register', payload);
  console.log('Response status:', res.status);
  console.log('Response data:', res.data);
  alert('Registration successful!');
  navigate('/');
} catch (error) {
  console.error('Registration failed:', error);
  if (error.response) {
    console.error('Error response data:', error.response.data);
    alert(error.response.data.message || 'Error occurred');
  } else {
    alert('Something went wrong!');
  }
}
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="name"
          placeholder="Name"
          required
          className="w-full border p-2"
          value={form.name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="w-full border p-2"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="w-full border p-2"
          value={form.password}
          onChange={handleChange}
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full border p-2"
        >
          <option value="engineer">Engineer</option>
          <option value="manager">Manager</option>
        </select>

        {form.role === 'engineer' && (
          <>
            <input
              type="text"
              name="skills"
              placeholder="Skills (comma-separated)"
              className="w-full border p-2"
              value={form.skills}
              onChange={handleChange}
            />

            <select
              name="seniority"
              value={form.seniority}
              onChange={handleChange}
              className="w-full border p-2"
            >
              <option value="junior">Junior</option>
              <option value="mid">Mid</option>
              <option value="senior">Senior</option>
            </select>

            <select
              name="maxCapacity"
              value={form.maxCapacity}
              onChange={handleChange}
              className="w-full border p-2"
            >
              <option value={100}>Full-time (100%)</option>
              <option value={50}>Part-time (50%)</option>
            </select>
          </>
        )}

        <input
          type="text"
          name="department"
          placeholder="Department"
          className="w-full border p-2"
          value={form.department}
          onChange={handleChange}
        />

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Register
        </button>

      </form>
    </div>
  );
}

export default Register;
