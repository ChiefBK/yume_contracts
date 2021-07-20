const BookingManager = artifacts.require("BookingManager");
const ListingManager = artifacts.require("ListingManager");
const DateTime = artifacts.require("DateTime");

module.exports = async function(deployer, network, accounts) {
  const listingManager = await ListingManager.deployed();

  await deployer.link(DateTime, BookingManager);
  await deployer.deploy(BookingManager, listingManager.address);
  const bookingManager = await BookingManager.deployed();
};
