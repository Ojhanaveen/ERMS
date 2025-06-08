import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import { AuthContext } from '../context/AuthContext';

function calculateProgress(assignedOn, deadline) {
  const totalDuration = new Date(deadline) - new Date(assignedOn);
  const elapsed = Date.now() - new Date(assignedOn);
  return Math.min(100, Math.round((elapsed / totalDuration) * 100));
}

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedEngineer, setSelectedEngineer] = useState(null);
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showAssignments, setShowAssignments] = useState(false);
  const [error, setError] = useState('');

  const { user, logout, token } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect to login if no user found
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user]);

  // Manager: Fetch users
  useEffect(() => {
    async function fetchUsers() {
      if (user?.role !== 'manager') return;

      setLoading(true);
      setError('');
      try {
        const params = { page, limit: 10 };
        if (roleFilter) params.role = roleFilter;

        const res = await API.get('/users', {
          params,
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const total = parseInt(res.headers['x-total-count'] || '1');
        setUsers(res.data);
        setPages(Math.ceil(total / 10));
      } catch (err) {
        if ([401, 403].includes(err.response?.status)) {
          alert('Session expired. Please log in again.');
          logout();
        } else {
          setError('Failed to load users.');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [page, roleFilter, user, token]);

  // Engineer or Manager: Fetch assignments
  const fetchAssignments = async (engineerId = null) => {
    try {
      const params = engineerId ? { engineerId } : {};
      const res = await API.get('/assignments', {
        params,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAssignments(res.data);
      setShowAssignments(true);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch assignments.');
    }
  };

  const handleEngineerClick = (engineer) => {
    setSelectedEngineer(engineer);
    fetchAssignments(engineer._id);
  };

  const renderAssignments = () => (
    <div className="mt-6">
      <h3 className="text-xl font-bold mb-2">
        {user?.role === 'manager'
          ? `Assignments for ${selectedEngineer?.name}`
          : 'My Assignments'}
      </h3>
      {assignments.length === 0 ? (
        <p>No assignments found.</p>
      ) : (
        <div className="space-y-4">
          {assignments.map((a, idx) => (
            <div key={idx} className="bg-white p-4 rounded shadow">
              <h4 className="font-semibold">{a.project.name}</h4>
              <p><strong>Deadline:</strong> {new Date(a.deadline).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {a.status}</p>
              <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                <div
                  className={`h-4 rounded-full ${
                    a.status === 'Completed' ? 'bg-green-600' : 'bg-yellow-500'
                  }`}
                  style={{
                    width: `${calculateProgress(a.assignedOn, a.deadline)}%`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
      </div>

      {/* Engineer: View Assignments and Profile */}
      {user?.role === 'engineer' && (
        <>
          <button
            onClick={() => fetchAssignments()}
            className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Show My Assignments
          </button>

          <div className="bg-white p-4 rounded shadow mb-4">
            <h3 className="text-xl font-semibold mb-2">My Profile</h3>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
          </div>
        </>
      )}

      {/* Manager: View All Engineers */}
      {user?.role === 'manager' && (
        <>
          <div className="mb-4">
            <select
              className="border border-gray-300 p-2 rounded"
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Roles</option>
              <option value="manager">Manager</option>
              <option value="engineer">Engineer</option>
              <option value="user">User</option>
            </select>
          </div>

          {loading ? (
            <p>Loading users...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <table className="min-w-full bg-white shadow border">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 border">Sr. No</th>
                  <th className="py-2 px-4 border">Name</th>
                  <th className="py-2 px-4 border">Email</th>
                  <th className="py-2 px-4 border">Role</th>
                  <th className="py-2 px-4 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, idx) => (
                  <tr key={u._id} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border">{(page - 1) * 10 + idx + 1}</td>
                    <td className="py-2 px-4 border">{u.name}</td>
                    <td className="py-2 px-4 border">{u.email}</td>
                    <td className="py-2 px-4 border capitalize">{u.role}</td>
                    <td className="py-2 px-4 border">
                      {u.role === 'engineer' && (
                        <button
                          onClick={() => handleEngineerClick(u)}
                          className="bg-blue-500 text-white px-3 py-1 rounded"
                        >
                          View Assignments
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="mt-4 flex justify-center items-center space-x-4">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span>Page {page} of {pages}</span>
              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, pages))}
                disabled={page === pages}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Assignment Section */}
      {showAssignments && renderAssignments()}
    </div>
  );
}
