const ListingManager = artifacts.require("ListingManager");

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(ListingManager);
  const listingManager = await ListingManager.deployed();
};
