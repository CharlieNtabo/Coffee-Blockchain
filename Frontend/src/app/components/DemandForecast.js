'use client'

import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function DemandForecast() {
  const [predictedDemand, setPredictedDemand] = useState(null);

  const fetchForecast = async () => {
    try {
      const response = await fetch(`${API_URL}/forecast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ historicalData: [] }),
      });
      const data = await response.json();
      setPredictedDemand(data.predictedDemand);
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="p-6 bg-gray-800 bg-opacity-50 rounded-xl shadow-lg border border-cyan-500">
      <h2 className="text-2xl font-semibold mb-4 text-cyan-300">Demand Forecast</h2>
      <button
        onClick={fetchForecast}
        className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all mb-4"
      >
        Get Forecast
      </button>
      {predictedDemand && (
        <p className="text-lg text-blue-300">
          Predicted demand for next month: <span className="font-bold">{predictedDemand} units</span>
        </p>
      )}
    </div>
  );
}
