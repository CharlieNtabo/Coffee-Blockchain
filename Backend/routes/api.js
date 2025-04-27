const express = require('express');
const router = express.Router();
const blockchain = require('../services/blockchain');
const forecasting = require('../services/forecasting');

const sanitizeBigInt = (value) => {
  return typeof value === 'bigint' ? value.toString() : value;
};

const sanitizeResponse = (response) => {
  return JSON.parse(
    JSON.stringify(response, (key, value) => sanitizeBigInt(value))
  );
};

router.post('/batch', async (req, res) => {
  try {
    const { origin, inventory } = req.body;
    if (!origin || typeof inventory !== 'number') {
      return res.status(400).json({ error: 'Origin and valid inventory are required' });
    }
    const result = await blockchain.createBatch(origin, inventory);
    const sanitizedResult = sanitizeResponse(result);
    res.json(sanitizedResult);
  } catch (error) {
    console.error('Create batch error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/batch/:id/stage', async (req, res) => {
  try {
    const { id } = req.params;
    const { stage } = req.body;
    if (isNaN(id) || isNaN(stage)) {
      return res.status(400).json({ error: 'Valid batch ID and stage are required' });
    }
    const result = await blockchain.updateStage(id, stage);
    const sanitizedResult = sanitizeResponse(result);
    res.json(sanitizedResult);
  } catch (error) {
    console.error('Update stage error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/batch/:id/inventory', async (req, res) => {
  try {
    const { id } = req.params;
    const { inventory } = req.body;
    if (isNaN(id) || typeof inventory !== 'number') {
      return res.status(400).json({ error: 'Valid batch ID and inventory are required' });
    }
    const result = await blockchain.updateInventory(id, inventory);
    const sanitizedResult = sanitizeResponse(result);
    res.json(sanitizedResult);
  } catch (error) {
    console.error('Update inventory error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/batch/:id/distribute', async (req, res) => {
  try {
    const { id } = req.params;
    const { distributor } = req.body;

    // Validate inputs
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Valid batch ID is required' });
    }
    if (!distributor || typeof distributor !== 'string' || distributor.trim() === '') {
      return res.status(400).json({ error: 'Distributor name is required' });
    }

    // Get the current batch state
    const batch = await blockchain.getBatch(id);
    const sanitizedBatch = sanitizeResponse(batch);

    // Convert stage to number for comparison
    const currentStage = Number(sanitizedBatch.stage);
    if (currentStage !== 3) {
      return res.status(400).json({
        error: `Batch must be in Packaged state (currently ${currentStage})`,
      });
    }

    // Perform distribution
    const result = await blockchain.distributeBatch(id, distributor.trim());
    const sanitizedResult = sanitizeResponse(result); // Use consistent sanitization

    res.json(sanitizedResult);
  } catch (error) {
    console.error('Distribution error:', error);
    res.status(500).json({
      error: error.message,
      details: 'Ensure batch is in Packaged stage and distributor is provided',
    });
  }
});

router.get('/batch/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Valid batch ID is required' });
    }
    const batch = await blockchain.getBatch(id);
    const sanitizedBatch = sanitizeResponse(batch);
    // Ensure numeric fields are numbers
    const formattedBatch = {
      ...sanitizedBatch,
      id: Number(sanitizedBatch.id),
      stage: Number(sanitizedBatch.stage),
      inventory: Number(sanitizedBatch.inventory),
      timestamp: Number(sanitizedBatch.timestamp),
    };
    res.json(formattedBatch);
  } catch (error) {
    console.error('Get batch error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/batches', async (req, res) => {
  try {
    const count = await blockchain.getBatchCount();
    const sanitizedCount = sanitizeResponse(count);
    const batches = [];
    for (let i = 1; i <= sanitizedCount; i++) {
      const batch = await blockchain.getBatch(i);
      const sanitizedBatch = sanitizeResponse(batch);
      batches.push({
        ...sanitizedBatch,
        id: Number(sanitizedBatch.id),
        stage: Number(sanitizedBatch.stage),
        inventory: Number(sanitizedBatch.inventory),
        timestamp: Number(sanitizedBatch.timestamp),
      });
    }
    res.json(batches);
  } catch (error) {
    console.error('Get batches error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/forecast', async (req, res) => {
  try {
    const { historicalData } = req.body;
    if (!historicalData || !Array.isArray(historicalData)) {
      return res.status(400).json({ error: 'Valid historical data is required' });
    }
    const prediction = await forecasting.predictDemand(historicalData);
    res.json({ predictedDemand: prediction });
  } catch (error) {
    console.error('Forecast error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;