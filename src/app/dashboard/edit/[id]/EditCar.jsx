'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../../../context/AuthContext';

export default function EditCar({ initialCar }) {
  const { id } = useParams();
  const nav = useRouter();
  const { user } = useAuth();
  const [name, setName] = useState(initialCar ? initialCar.title : '');
  const [loading, setLoading] = useState(!initialCar);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!user) {
      nav.push('/login');
      return;
    }
    if (!initialCar) {
      getCar();
    }
  }, [id, user]);

  function getCar() {
    setLoading(true);
    let url = '/api/listings';
    fetch(url)
      .then(res => {
        if (!res.ok) {
          setErr('Cant load car data');
          setLoading(false);
          return;
        }
        res.json().then(data => {
          let car = data.find(item => item.id == id);
          if (!car) {
            nav.push('/dashboard');
            return;
          }
          setName(car.title);
          setLoading(false);
          setErr(null);
        });
      })
      .catch(e => {
        setErr('Something broke');
        setLoading(false);
      });
  }

  const saveChanges = async e => {
    e.preventDefault();
    let payload = { id, title: name };
    fetch('/api/listings/' + id, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(res => {
      if (!res.ok) {
        setErr('Failed to save changes');
        return;
      }
      nav.push('/dashboard');
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Edit Car Listing</h1>
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

        {loading ? (
          <div className="p-4">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : (
          <form onSubmit={saveChanges} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Car Name"
                className="w-full p-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 active:bg-blue-800 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}