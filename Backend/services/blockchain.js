const { Web3 } = require('web3');
const contractABI = require('../../build/contracts/CoffeeSupplyChain.json').abi;
const contractAddress = process.env.CONTRACT_ADDRESS;

const web3 = new Web3(process.env.BLOCKCHAIN_URL || 'http://127.0.0.1:7545');
const contract = new web3.eth.Contract(contractABI, contractAddress);

const account = process.env.OWNER_ADDRESS;


const createBatch = async (origin, inventory) => {
  return await contract.methods.createBatch(origin, inventory).send({ from: account, gas: 300000 });
};

const updateStage = async (batchId, stage) => {
  return await contract.methods.updateStage(batchId, stage).send({ from: account, gas: 300000 });
};

const updateInventory = async (batchId, inventory) => {
  return await contract.methods.updateInventory(batchId, inventory).send({ from: account, gas: 300000 });
};

const distributeBatch = async (batchId, distributor) => {
    try {
      const result = await contract.methods.distributeBatch(batchId, distributor)
        .send({ from: account, gas: 500000 });
      
      // Convert BigInt values to strings
      return {
        ...result,
        blockNumber: result.blockNumber.toString(),
        gasUsed: result.gasUsed.toString(),
        effectiveGasPrice: result.effectiveGasPrice.toString(),
      };
    } catch (error) {
      console.error("Blockchain distribution error:", error);
      throw error;
    }
  };
  
const getBatch = async (batchId) => {
  return await contract.methods.getBatch(batchId).call();
};

const getBatchCount = async () => {
  return await contract.methods.batchCount().call();
};

module.exports = {
  createBatch,
  updateStage,
  updateInventory,
  distributeBatch,
  getBatch,
  getBatchCount,
};