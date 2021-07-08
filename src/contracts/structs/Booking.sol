// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

//import './PriceRule.sol';

struct Booking {
	uint64 startEpochTime;
	uint64 endEpochTime;
	address owner;
}
