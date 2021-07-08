// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import './structs/PriceRule.sol';
import './structs/Listing.sol';
import "./Manager.sol";

contract ListingManager is Manager {
	mapping(uint => Listing) listings;
	mapping(uint => PriceRule[]) priceRules;

	uint public numOfListings = 0;
	address public owner;
	string public name = "Listing Manager";

	constructor() {
		owner = msg.sender;
	}

	function createListing(uint _propertyId, string memory _rules, string memory _guestInfo) public returns (uint) {
		Listing storage newListing = listings[numOfListings++];
		newListing.rules = _rules;
		newListing.guestInfo = _guestInfo;
		newListing.propertyId = _propertyId;
		newListing.owner = msg.sender;

		return numOfListings - 1;
	}

	function editListing(uint _listingId, string memory _rules, string memory _guestInfo) public returns (uint) {
		Listing storage requestedListing = listings[_listingId];

		require(requestedListing.owner == msg.sender);

		requestedListing.rules = _rules;
		requestedListing.guestInfo = _guestInfo;

		return _listingId;
	}

	function appendPrice(uint _listingId, uint64 _amountInCents, bytes3 _currency, uint64 _startEpochTime, uint64 _endEpochTime) public isAtMidnight(_startEpochTime, _endEpochTime) returns (uint) {
		Listing storage listing = listings[_listingId];
		uint64 startTime;

		if (_startEpochTime == 0) {
			startTime = uint64(block.timestamp);
		} else {
			startTime = _startEpochTime;
		}

		PriceRule memory price = PriceRule(_amountInCents, _currency, startTime, _endEpochTime);
		priceRules[_listingId].push(price);

		return listing.numOfPrices++;
	}

	function determinePrice(uint _listingId, uint64 _startTime, uint64 _endTime) public view isAtMidnight(_startTime, _endTime) returns (uint) {
		Listing storage listing = listings[_listingId];

		uint secsInDay = 86400;
		uint numOfPrices = listing.numOfPrices;
		uint totalPrice = 0;
		uint currentPriceIndex = 0;
		uint timeCursor = _startTime;

		while (timeCursor <= _endTime && currentPriceIndex < numOfPrices) {
			PriceRule storage p = priceRules[_listingId][currentPriceIndex];

			if (timeCursor >= p.startEpochTime) {
				if (p.endEpochTime == 0 || timeCursor <= p.endEpochTime) { // if there is no end datetime OR cursor is before/equal to end time
					totalPrice += p.amountInCents;
					timeCursor += secsInDay;
					continue;
				}
			}

			currentPriceIndex++;
		}

		return totalPrice;
	}

	function getListingOwner(uint _listingId) public view returns (address) {
		return listings[_listingId].owner;
	}

	function getListingRules(uint _listingId) public view returns (string memory) {
		return listings[_listingId].rules;
	}

	function getListingGuestInfo(uint _listingId) public view returns (string memory) {
		return listings[_listingId].guestInfo;
	}

	function getListingPropertyId(uint _listingId) public view returns (uint) {
		return listings[_listingId].propertyId;
	}

	function getListingNumPrices(uint _listingId) public view returns (uint) {
		return listings[_listingId].numOfPrices;
	}

	function getListingPriceAmount(uint _listingId, uint _priceId) public view returns (uint64) {
		require(getListingNumPrices(_listingId) > _priceId, "can not pass Price ID greater then length");

		return priceRules[_listingId][_priceId].amountInCents;
	}

	function getListingPriceCurrency(uint _listingId, uint _priceId) public view returns (bytes3) {
		require(getListingNumPrices(_listingId) > _priceId, "can not pass Price ID greater then length");

		return priceRules[_listingId][_priceId].currency;
	}

	function getListingPriceStartTime(uint _listingId, uint _priceId) public view returns (uint64) {
		require(getListingNumPrices(_listingId) > _priceId, "can not pass Price ID greater then length");

		return priceRules[_listingId][_priceId].startEpochTime;
	}

	function getListingPriceEndTime(uint _listingId, uint _priceId) public view returns (uint64) {
		require(getListingNumPrices(_listingId) > _priceId, "can not pass Price ID greater then length");

		return priceRules[_listingId][_priceId].endEpochTime;
	}
}
