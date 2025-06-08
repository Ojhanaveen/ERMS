import React, { useEffect, useState, useContext } from 'react';
import API from '../api/api';
import { AuthContext } from '../context/AuthContext';

import {
  FaUserTie,
  FaProjectDiagram,
  FaPlus,
  FaList,
  FaSpinner,
} from 'react-icons/fa';

export default function AssignmentDashboard() {
  const { user } = useContext(AuthContext);
  const [engineers, setEngineers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [selectedEngineer, setSelectedEngineer] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [allocationPercentage, setAllocationPercentage] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [role, setRole] = useState('');

  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [engRes, projRes, assignRes] = await Promise.all([
        API.get('/engineers'),
        API.get('/projects'),
        API.get('/assignments'),
      ]);

      setEngineers(Array.isArray(engRes.data) ? engRes.data : []);
      setProjects(Array.isArray(projRes.data) ? projRes.data : []);
      setAssignments(Array.isArray(assignRes.data) ? assignRes.data : []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleAssign = async () => {
    if (!selectedEngineer || !selectedProject || !role || !allocationPercentage || !startDate || !endDate) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      setAssigning(true);
      await API.post('/assignments/assign', {
        engineerId: selectedEngineer,
        projectId: selectedProject,
        role,
        allocationPercentage: Number(allocationPercentage),
        startDate,
        endDate,
      });

      alert('Engineer assigned successfully!');
      setSelectedEngineer('');
      setSelectedProject('');
      setRole('');
      setAllocationPercentage('');
      setStartDate('');
      setEndDate('');
      fetchAll();
    } catch (err) {
      console.error('Error assigning:', err);
      alert(err?.response?.data?.message || 'Assignment failed.');
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 flex items-center justify-center gap-2">
        <FaList /> Assignment Dashboard
      </h1>

      {/* Assignment Form */}
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <select
          className="p-2 border rounded"
          value={selectedEngineer}
          onChange={(e) => setSelectedEngineer(e.target.value)}
        >
          <option value="">Select Engineer</option>
          {engineers.map((eng) => (
            <option key={eng._id} value={eng._id}>
              {eng.name}
            </option>
          ))}
        </select>

        <select
          className="p-2 border rounded"
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          <option value="">Select Project</option>
          {projects.map((proj) => (
            <option key={proj._id} value={proj._id}>
              {proj.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Role"
          className="p-2 border rounded"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />

        <input
          type="number"
          placeholder="Allocation %"
          className="p-2 border rounded"
          value={allocationPercentage}
          onChange={(e) => setAllocationPercentage(e.target.value)}
        />

        <input
          type="date"
          className="p-2 border rounded"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <input
          type="date"
          className="p-2 border rounded"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <button
          onClick={handleAssign}
          disabled={assigning}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {assigning ? <FaSpinner className="animate-spin" /> : <FaPlus />}
          {assigning ? 'Assigning...' : 'Assign'}
        </button>
      </div>

      {/* Assignment Table */}
      <h2 className="text-xl font-semibold text-gray-700 mb-2">Current Assignments</h2>
      {loading ? (
        <p className="text-center text-gray-500">Loading data...</p>
      ) : assignments.length === 0 ? (
        <p className="text-center text-gray-500">No assignments yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded shadow-md">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="py-2 px-4 border">#</th>
                <th className="py-2 px-4 border">Engineer</th>
                <th className="py-2 px-4 border">Project</th>
                <th className="py-2 px-4 border">Role</th>
                <th className="py-2 px-4 border">Allocation</th>
                <th className="py-2 px-4 border">Start</th>
                <th className="py-2 px-4 border">End</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a, idx) => (
                <tr key={a._id} className="text-gray-700 hover:bg-gray-50">
                  <td className="py-2 px-4 border">{idx + 1}</td>
                  <td className="py-2 px-4 border">{a.engineerId?.name}</td>
                  <td className="py-2 px-4 border">{a.projectId?.name}</td>
                  <td className="py-2 px-4 border">{a.role}</td>
                  <td className="py-2 px-4 border">{a.allocationPercentage}%</td>
                  <td className="py-2 px-4 border">{a.startDate?.substring(0, 10)}</td>
                  <td className="py-2 px-4 border">{a.endDate?.substring(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
