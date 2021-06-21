// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import './Price.sol';

struct Listing {
	string rules;
	string guestInfo;
	uint propertyId;
	mapping(uint => Price) prices;
	uint numOfPrices;
	address owner;
}
