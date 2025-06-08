import React, { useEffect, useState, useContext } from 'react';
import axios from '../api/axios';
import { format } from 'date-fns';
import { AuthContext } from '../context/AuthContext';

function EngineerDashboard() {
  const { user, token } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get('/assignmentsdashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAssignments(res.data);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'engineer') {
      fetchAssignments();
    } else {
      setLoading(false); // Stop loading if not engineer
    }
  }, [user, token]);

  if (loading) return <p>Loading assignments...</p>;

  return (
    <div className="pt-20 p-4">
      <h2 className="text-xl font-bold mb-4">My Assignments</h2>
      {assignments.length === 0 ? (
        <p>No assignments found.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border p-2">Project</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Start Date</th>
              <th className="border p-2">End Date</th>
              <th className="border p-2">Allocation %</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((a) => (
              <tr key={a._id}>
                <td className="border p-2">{a.project?.name || 'N/A'}</td>
                <td className="border p-2">{a.role || 'Developer'}</td>
                <td className="border p-2">
                  {a.startDate ? format(new Date(a.startDate), 'yyyy-MM-dd') : 'N/A'}
                </td>
                <td className="border p-2">
                  {a.endDate ? format(new Date(a.endDate), 'yyyy-MM-dd') : 'N/A'}
                </td>
                <td className="border p-2">{a.allocationPercentage ?? '100'}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default EngineerDashboard;
