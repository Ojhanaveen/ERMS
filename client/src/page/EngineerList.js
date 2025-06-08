import React, { useEffect, useState } from "react";
import axios from "axios";

const EngineerList = () => {
  const [engineers, setEngineers] = useState([]);

useEffect(() => {
  const fetchEngineers = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('/engineers', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setEngineers(res.data);
  };
  fetchEngineers();
}, []); 

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4">Engineers</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded border">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="py-2 px-4 border">#</th>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">Skills</th>
              <th className="py-2 px-4 border">Seniority</th>
              <th className="py-2 px-4 border">Department</th>
              <th className="py-2 px-4 border">Max Capacity</th>
            </tr>
          </thead>
          <tbody>
            {engineers.map((eng, idx) => (
              <tr key={eng._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border">{idx + 1}</td>
                <td className="py-2 px-4 border">{eng.name}</td>
                <td className="py-2 px-4 border">{eng.email}</td>
                <td className="py-2 px-4 border">
                  <div className="flex flex-wrap gap-1">
                    {eng.skills?.map((skill) => (
                      <span
                        key={skill}
                        className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-2 px-4 border capitalize">{eng.seniority}</td>
                <td className="py-2 px-4 border">{eng.department}</td>
                <td className="py-2 px-4 border">
                  <div className="w-full bg-gray-200 rounded">
                    <div
                      className="bg-green-500 text-xs font-medium text-white text-center p-1 rounded"
                      style={{ width: `${eng.maxCapacity}%` }}
                    >
                      {eng.maxCapacity}%
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EngineerList;
