// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CoffeeSupplyChain {
    address public owner;

    enum Stage { Created, Roasted, Ground, Packaged, Distributed }

    struct Batch {
        uint id;
        string origin;
        uint timestamp;
        Stage stage;
        uint inventory;
        string distributor;
    }

    mapping(uint => Batch) public batches;
    uint public batchCount;

    event BatchCreated(uint id, string origin, uint timestamp);
    event StageUpdated(uint id, Stage stage, uint timestamp);
    event InventoryUpdated(uint id, uint inventory, uint timestamp);
    event Distributed(uint id, string distributor, uint timestamp);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    function createBatch(string memory _origin, uint _initialInventory) public onlyOwner {
        batchCount++;
        batches[batchCount] = Batch(batchCount, _origin, block.timestamp, Stage.Created, _initialInventory, "");
        emit BatchCreated(batchCount, _origin, block.timestamp);
    }

    function updateStage(uint _batchId, Stage _stage) public onlyOwner {
        require(_batchId <= batchCount && _batchId > 0, "Invalid batch ID");
        require(uint(_stage) > uint(batches[_batchId].stage), "Cannot revert stage");
        batches[_batchId].stage = _stage;
        emit StageUpdated(_batchId, _stage, block.timestamp);
    }

    function updateInventory(uint _batchId, uint _inventory) public onlyOwner {
        require(_batchId <= batchCount && _batchId > 0, "Invalid batch ID");
        batches[_batchId].inventory = _inventory;
        emit InventoryUpdated(_batchId, _inventory, block.timestamp);
    }

    function distributeBatch(uint _batchId, string memory _distributor) public onlyOwner {
        require(_batchId <= batchCount && _batchId > 0, "Invalid batch ID");
        require(batches[_batchId].stage == Stage.Packaged, "Batch not ready for distribution");
        require(bytes(_distributor).length > 0, "Distributor must be provided");

        batches[_batchId].stage = Stage.Distributed;
        batches[_batchId].distributor = _distributor;
        emit Distributed(_batchId, _distributor, block.timestamp);
    }

    function getBatch(uint _batchId) public view returns (Batch memory) {
        require(_batchId <= batchCount && _batchId > 0, "Invalid batch ID");
        return batches[_batchId];
    }
}
