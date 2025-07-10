'use client';

import { useState, useEffect, memo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

const LogRow = memo(({ log, idx }) => (
  <tr key={idx} className="border-t hover:bg-gray-50 transition">
    <td className="p-3 text-gray-800">{log.admin}</td>
    <td className="p-3 text-gray-600 capitalize">{log.action}</td>
    <td className="p-3 text-gray-800">{log.carId}</td>
    <td className="p-3 text-gray-600">{new Date(log.timestamp).toLocaleString()}</td>
  </tr>
));

export default function LogViewer({ initialLogs }) {
  const { user } = useAuth();
  const nav = useRouter();
  const [audit, setAudit] = useState(initialLogs || []);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!user) nav.push('/login');
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Audit Trail</h1>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 active:bg-blue-800 transition-colors"
            onClick={() => nav.push('/dashboard')}
          >
            Back to Dashboard
          </button>
        </div>

        {err && (
          <div className="mb-6 p-3 bg-red-100 text-red-600 rounded-md text-sm">{err}</div>
        )}

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-4">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left text-gray-600 font-semibold">Admin</th>
                  <th className="p-3 text-left text-gray-600 font-semibold">Action</th>
                  <th className="p-3 text-left text-gray-600 font-semibold">Car ID</th>
                  <th className="p-3 text-left text-gray-600 font-semibold">Time</th>
                </tr>
              </thead>
              <tbody>
                {audit.length > 0 ? (
                  audit.map((log, idx) => (
                    <LogRow key={idx} log={log} idx={idx} />
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-3 text-center text-gray-500">No logs found</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}