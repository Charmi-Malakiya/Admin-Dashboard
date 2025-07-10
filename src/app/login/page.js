'use client';

import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

const InputIcon = ({ type }) => (
  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
    {type === 'username' ? '👤' : '🔒'}
  </span>
);

export default function AdminSignIn() {
  const { login } = useAuth();
  const [uname, setUname] = useState(''); 
  const [pwd, setPwd] = useState(''); 
  const [err, setErr] = useState(null); 

  const doLogin = () => {
    if (!uname || !pwd) {
      setErr('Please fill in both fields');
      return;
    }
    try {
      login(uname, pwd);
      setErr(null); 
    } catch (error) {
      setErr('Login failed, check credentials'); 
      console.log('login issue:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Admin Sign-In
        </h1>

        {err && (
          <div className="mb-4 p-2 bg-red-100 text-red-600 rounded text-sm">
            {err}
          </div>
        )}

        <div className="mb-4 relative">
          <InputIcon type="username" />
          <input
            type="text"
            value={uname}
            onChange={e => setUname(e.target.value)}
            placeholder="Username"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          />
        </div>

        <div className="mb-6 relative">
          <InputIcon type="password" />
          <input
            type="password"
            value={pwd}
            onChange={e => setPwd(e.target.value)}
            placeholder="Password"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          />
        </div>

        <button
          onClick={doLogin}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 active:bg-blue-800 transition-colors"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}