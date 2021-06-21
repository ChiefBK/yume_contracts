const PriceManager = artifacts.require("PriceManager");
const ListingManager = artifacts.require("ListingManager");

module.exports = async function(deployer, network, accounts) {
  const listingManager = await ListingManager.deployed();

  await deployer.deploy(PriceManager, listingManager.address);
  const priceManager = await PriceManager.deployed();
};
