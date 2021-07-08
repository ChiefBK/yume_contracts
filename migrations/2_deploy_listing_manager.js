const ListingManager = artifacts.require("ListingManager");
const Manager = artifacts.require("Manager");
const DateTime = artifacts.require("DateTime");

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(DateTime);
  await deployer.link(DateTime, [Manager, ListingManager]);
  await deployer.deploy(Manager);
  await deployer.deploy(ListingManager);
  const manager = await Manager.deployed();
  const listingManager = await ListingManager.deployed();
  const dateTime = await DateTime.deployed();
};
