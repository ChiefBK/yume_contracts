// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

//import './Price.sol';

struct Booking {
	uint listingId;
	uint64 startEpochTime;
	uint64 endEpochTime;
	address bookingOwner;
}
