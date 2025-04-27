'use client'

import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function BatchForm() {
  const [origin, setOrigin] = useState('');
  const [inventory, setInventory] = useState('');
  const [batchId, setBatchId] = useState('');
  const [stage, setStage] = useState('0');
  const [distributor, setDistributor] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState(''); // success, error, etc.
  const [showAlert, setShowAlert] = useState(false);
  const [showFullMessage, setShowFullMessage] = useState(false);

  const createBatch = async () => {
    try {
      const response = await fetch(`${API_URL}/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin, inventory: parseInt(inventory) }),
      });
      const data = await response.json();
      setAlertType('success');
      setAlertMessage('Batch created: ' + JSON.stringify(data));
      setShowAlert(true);
    } catch (error) {
      setAlertType('error');
      setAlertMessage('Error: ' + error.message);
      setShowAlert(true);
    }
  };

  const updateStage = async () => {
    try {
      const response = await fetch(`${API_URL}/batch/${batchId}/stage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: parseInt(stage) }),
      });
      const data = await response.json();
      setAlertType('success');
      setAlertMessage('Stage updated: ' + JSON.stringify(data));
      setShowAlert(true);
    } catch (error) {
      setAlertType('error');
      setAlertMessage('Error: ' + error.message);
      setShowAlert(true);
    }
  };

  const updateInventory = async () => {
    // Check if batchId is valid before proceeding
    if (!batchId.trim()) {
      alert('Batch ID is required');
      return; // Prevent the API call if batchId is missing or empty
    }
  
    try {
      const trimmedBatchId = batchId.trim(); // Trim any extra spaces from the batchId
  
      const response = await fetch(`${API_URL}/batch/${trimmedBatchId}/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inventory: parseInt(inventory) }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setAlertType('success');
        setAlertMessage('Inventory updated: ' + JSON.stringify(data));
        setShowAlert(true);
      } else {
        const errorData = await response.json();
        setAlertType('error');
        setAlertMessage('Error: ' + errorData.message || 'Something went wrong');
        setShowAlert(true);
      }
    } catch (error) {
      // Catch network or other errors
      setAlertType('error');
      setAlertMessage('Error: ' + error.message);
      setShowAlert(true);
    }
  };
  

  const distributeBatch = async () => {
    try {
      // Validate inputs
      if (!batchId || isNaN(batchId)) {
        throw new Error('Please enter a valid batch ID');
      }
      
      if (!distributor || distributor.trim() === '') {
        throw new Error('Distributor name is required');
      }
  
      // Check current stage
      const batchResponse = await fetch(`${API_URL}/batch/${batchId}`);
      const batch = await batchResponse.json();
      
      if (Number(batch.stage) !== 3) {
        throw new Error(`Batch must be in Packaged state (currently ${batch.stage})`);
      }
  
      // Make distribution request
      const response = await fetch(`${API_URL}/batch/${batchId}/distribute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ distributor }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Distribution failed');
      }
      
      const data = await response.json();
      setAlertType('success');
      setAlertMessage(
        `Batch #${batchId} distributed to ${distributor}\n` +
        `TX Hash: ${data.transactionHash}`
      );
      setShowAlert(true);
    } catch (error) {
      setAlertType('error');
      setAlertMessage('Error: ' + error.message);
      setShowAlert(true);
    }
  };
  
  const getLimitedText = (text, maxLength = 200) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    setShowFullMessage(false); // Reset to truncated view when closing
  };

  return (
    <div className="mb-12 p-6 bg-gray-800 bg-opacity-50 rounded-xl shadow-lg border border-cyan-500">
      <h2 className="text-2xl font-semibold mb-4 text-cyan-300">Manage Batches</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-xl font-medium text-blue-300">Create Batch</h3>
          <input
            type="text"
            placeholder="Origin (e.g., Ethiopia)"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            type="number"
            placeholder="Inventory (units)"
            value={inventory}
            onChange={(e) => setInventory(e.target.value)}
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <button
            onClick={createBatch}
            className="w-full p-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all"
          >
            Create Batch
          </button>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-medium text-blue-300">Update Batch</h3>
          <input
            type="number"
            placeholder="Batch ID"
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <select
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="0">Created</option>
            <option value="1">Roasted</option>
            <option value="2">Ground</option>
            <option value="3">Packaged</option>
            <option value="4">Distributed</option>
          </select>
          <button
            onClick={updateStage}
            className="w-full p-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all"
          >
            Update Stage
          </button>
          <input
            type="number"
            placeholder="New Inventory"
            value={inventory}
            onChange={(e) => setInventory(e.target.value)}
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <button
            onClick={updateInventory}
            className="w-full p-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all"
          >
            Update Inventory
          </button>
          <input
            type="text"
            placeholder="Distributor"
            value={distributor}
            onChange={(e) => setDistributor(e.target.value)}
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <button
            onClick={distributeBatch}
            className="w-full p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            Distribute Batch
          </button>
        </div>
      </div>

    
           {showAlert && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className={`p-6 rounded-xl shadow-lg ${alertType === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white w-full max-w-lg max-h-[80vh] flex flex-col`}>
            <h3 className="text-xl font-semibold mb-4">
              {alertType === 'success' ? 'Success' : 'Error'}
            </h3>
            
            <div className="flex-grow overflow-y-auto mb-4 bg-black bg-opacity-30 p-3 rounded-lg">
              <pre className="whitespace-pre-wrap break-words font-sans">
                {showFullMessage ? alertMessage : getLimitedText(alertMessage)}
              </pre>
            </div>
            
            <div className="flex justify-end space-x-3">
              {!showFullMessage && alertMessage.length > 200 && (
                <button
                  onClick={() => setShowFullMessage(true)}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all"
                >
                  Show More
                </button>
              )}
              <button
                onClick={handleCloseAlert}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
