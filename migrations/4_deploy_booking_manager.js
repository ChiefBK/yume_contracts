const BookingManager = artifacts.require("BookingManager");
const DateTime = artifacts.require("DateTime");

module.exports = async function(deployer, network, accounts) {
  await deployer.link(DateTime, BookingManager);
  await deployer.deploy(BookingManager);
  const bookingManager = await BookingManager.deployed();
};
