'use client'

import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function BatchList() {
  const [batches, setBatches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await fetch(`${API_URL}/batches`);
        const data = await response.json();
        
        // Check if data is an array or nested inside an object
        if (Array.isArray(data)) {
          setBatches(data);
        } else if (Array.isArray(data.batches)) {
          setBatches(data.batches);
        } else {
          console.error('Unexpected batches response:', data);
          setBatches([]);
        }
      } catch (error) {
        console.error('Error fetching batches:', error);
        setBatches([]);
      }
    };
    fetchBatches();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(batches.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBatches = batches.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const stageNames = ['Created', 'Roasted', 'Ground', 'Packaged', 'Distributed'];

  return (
    <div className="mb-12 p-6 bg-gray-800 bg-opacity-50 rounded-xl shadow-lg border border-cyan-500">
      <h2 className="text-2xl font-semibold mb-4 text-cyan-300">Batch List</h2>
      {batches.length === 0 ? (
        <p className="text-gray-400">No batches available.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-gray-700 to-gray-900 text-blue-300">
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Origin</th>
                  <th className="p-3 text-left">Stage</th>
                  <th className="p-3 text-left">Inventory</th>
                  <th className="p-3 text-left">Distributor</th>
                  <th className="p-3 text-left">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {currentBatches.map((batch) => (
                  <tr key={batch.id} className="border-b border-gray-700 hover:bg-gray-700 transition-all">
                    <td className="p-3">{batch.id}</td>
                    <td className="p-3">{batch.origin || 'N/A'}</td>
                    <td className="p-3">{stageNames[batch.stage] || 'Unknown'}</td>
                    <td className="p-3">{batch.inventory}</td>
                    <td className="p-3">{batch.distributor || '-'}</td>
                    <td className="p-3">{new Date(batch.timestamp * 1000).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          <div className="mt-4 flex justify-center items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg text-white ${
                currentPage === 1
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600'
              }`}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === page
                    ? 'bg-cyan-500 text-white'
                    : 'bg-gray-900 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg text-white ${
                currentPage === totalPages
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600'
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}