// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import './ListingManager.sol';

contract PriceManager {
	// address public owner;
	// ListingManager listingManager;

	// constructor(ListingManager _listingManager) {
	// 	owner = msg.sender;
	// 	listingManager = _listingManager;
	// }

	// function appendPrice(uint _listingId, uint64 _amountInCents, bytes3 _currency, uint64 _startEpochTime, uint64 _endEpochTime) public returns (uint) {
	// 	Listing storage listing = listingManager.listings()[_listingId];
	// 	uint64 startTime;

	// 	if (_startEpochTime == 0) {
	// 		startTime = uint64(block.timestamp);
	// 	} else {
	// 		startTime = _startEpochTime;
	// 	}

	// 	Price memory price = Price(_amountInCents, _currency, startTime, _endEpochTime);
	// 	listing.prices[listing.numOfPrices++] = price;

	// 	return listing.numOfPrices - 1;
	// }

	// function determinePrice(uint _listingId, uint64 _dateTime) public view returns (int) {
	// 	Listing storage listing = listingManager.listings()[_listingId];

	// 	uint numOfPrices = listing.numOfPrices;

	// 	for (uint i = 0; i < numOfPrices; i++) {
	// 		Price storage p = listing.prices[i];
			
	// 		if (_dateTime > p.startEpochTime) {
	// 			if (p.endEpochTime == 0 || _dateTime < p.endEpochTime) {// if there is no end datetime to price
	// 				return int(i);
	// 			}
	// 		}
	// 	}

	// 	return -1;
	// }

	// function getPriceAmount(uint _listingId, uint _priceIndex) public returns (uint64) {
	// 	Price memory p = 
	// 	return 
	// }
}