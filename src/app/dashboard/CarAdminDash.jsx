'use client';

import { useState, useEffect, memo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';

const carStatus = {
  allTheCars: 'all',
  pending: 'pending',
  approve: 'approved',
  reject: 'rejected'
};

const CarRowThing = memo(({ car, updateCarFunc, goEdit }) => (
  <tr key={car.id} className="border-t hover:bg-gray-50 transition">
    <td className="p-3 text-gray-800">{car.title}</td>
    <td className="p-3 text-gray-600 capitalize">{car.status}</td>
    <td className='p-3 flex gap-2'>
      <button
        className='px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors'
        onClick={() => updateCarFunc(car.id, carStatus.approve)}
      >
        Approve
      </button>
      <button
        className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        onClick={() => updateCarFunc(car.id, carStatus.reject)}
      >
        Reject
      </button>
      <button
        className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        onClick={() => goEdit(car.id)}
      >
        Edit
      </button>
    </td>
  </tr>
));

export default function CarAdminDash({ initialCars }) {
  const { user, logout } = useAuth();
  let nav = useRouter();
  let [cars, setCars] = useState(initialCars || []);
  const [filt, setFilt] = useState(carStatus.allTheCars);
  let [pageNum, setPageNum] = useState(1);
  const [errMsg, setErrMsg] = useState(null);
  const sizeOfPage = 5;

  function updateCarFunc(carId, stat) {
    let payloadData = {
      action: stat,
      admin: user.name,
      when: new Date().toISOString()
    };
    let apiUrl = '/api/listings/' + carId;
    fetch(apiUrl, {
      method: 'PATCH',
      headers: { 'content-Type': 'application/json' },
      body: JSON.stringify(payloadData)
    }).then(resp => {
      if (resp.status != 200) {
        setErrMsg('Couldnt update car :(');
        return;
      }
      let logUrl = '/api/audit-log';
      fetch(logUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: stat,
          admin: user.name,
          carId: carId
        })
      });
      let newCars = [];
      let i = 0;
      while (i < cars.length) {
        let car = cars[i];
        if (car.id == carId) {
          newCars.push({ ...car, status: stat });
        } else {
          newCars.push(car);
        }
        i++;
      }
      setCars(newCars);
      setErrMsg(null);
    });
  }

  let visibleCars = [];
  if (filt == carStatus.allTheCars) {
    visibleCars = [...cars];
  } else {
    let temp = [];
    for (let c of cars) {
      if (c.status == filt) {
        temp.push(c);
      }
    }
    visibleCars = temp;
  }

  let paginated = visibleCars.slice((pageNum - 1) * sizeOfPage, pageNum * sizeOfPage);
  let totalPages = Math.ceil(visibleCars.length / sizeOfPage);

  const changeFilt = e => {
    setFilt(e.target.value);
    setPageNum(1);
  };

  function goEdit(id) {
    let editPath = '/dashboard/edit/' + id;
    nav.push(editPath);
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Car Rental Admin</h1>
          <div className="flex gap-3">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 active:bg-blue-800 transition-colors"
              onClick={() => nav.push('/dashboard/logs')}
            >
              View Logs
            </button>
            <button
              className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 active:bg-blue-800 transition'
              onClick={logout}
            >
              Sign Out
            </button>
          </div>
        </div>

        {errMsg && (
          <div className='mb-6 p-3 bg-red-100 text-red-600 rounded-md text-sm'>{errMsg}</div>
        )}

        <div className="mb-6">
          <select
            value={filt}
            onChange={changeFilt}
            className='w-48 p-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value={carStatus.allTheCars}>All Cars</option>
            <option value={carStatus.pending}>Pending</option>
            <option value={carStatus.approve}>Approved</option>
            <option value={carStatus.reject}>Rejected</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          {cars.length == 0 ? (
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
                  <th className="p-3 text-left text-gray-600 font-semibold">Car Name</th>
                  <th className='p-3 text-left text-gray-600 font-semibold'>Status</th>
                  <th className="p-3 text-left text-gray-600 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length > 0 ? (
                  paginated.map(car => (
                    <CarRowThing key={car.id} car={car} updateCarFunc={updateCarFunc} goEdit={goEdit} />
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="p-3 text-center text-gray-500">No cars found</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-4 flex justify-between items-center">
            <button
              className='px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition'
              onClick={() => setPageNum(pageNum - 1 >= 1 ? pageNum - 1 : 1)}
              disabled={pageNum == 1}
            >
              Previous
            </button>
            <span className="text-gray-600">Page {pageNum} of {totalPages}</span>
            <button
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              onClick={() => setPageNum(pageNum + 1 <= totalPages ? pageNum + 1 : totalPages)}
              disabled={pageNum == totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}