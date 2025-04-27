const CoffeeSupplyChain = artifacts.require("CoffeeSupplyChain");

module.exports = function (deployer) {
  deployer.deploy(CoffeeSupplyChain);
};