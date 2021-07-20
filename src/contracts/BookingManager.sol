// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./structs/Booking.sol";
import "./Manager.sol";
import "./ListingManager.sol";

contract BookingManager is Manager {
    uint public numOfBookings = 0;
    uint public bookingIndex = 1; // bookings start at index 1
    string public name = "Booking Manager";

    mapping(uint => Booking) bookings;
    ListingManager listingManager;
    mapping(address => uint) public guestEscrow;

    // maps a given listing ID (key) to a mapping ZZ.
    // The keys of ZZ are epoch times (at midnight) which map to a booking ID (the value)
    mapping(uint => mapping(uint => uint)) listingsToBookingDates;

    constructor(ListingManager _listingManager) {
        listingManager = _listingManager;
    }

    function createBooking(uint _listingId, uint64 _startTime, uint64 _endTime) public isAtMidnight2(_startTime, _endTime) payable returns (uint) {
        uint bookingId = bookingIndex++;

        uint expectedPrice = listingManager.determinePrice(_listingId, _startTime, _endTime);

        // check that the amount sent is equal to the expected price
        require(msg.value == expectedPrice);

        guestEscrow[msg.sender] += expectedPrice;

        Booking storage newBooking = bookings[bookingId];
        newBooking.startEpochTime = _startTime;
        newBooking.endEpochTime = _endTime;
        newBooking.owner = msg.sender;

        addBookingDatesToListing(_listingId, _startTime, _endTime, bookingId);
        numOfBookings++;

        return bookingId;
    }

    function addBookingDatesToListing(uint _listingId, uint64 _startTime, uint64 _endTime, uint _bookingId) private isAtMidnight2(_startTime, _endTime) {
        uint timeCursor = _startTime;

        while (timeCursor <= _endTime) {
            // If the listing has no booking for the given date
            if (listingsToBookingDates[_listingId][timeCursor] == 0) {
                listingsToBookingDates[_listingId][timeCursor] = _bookingId;
            }
            timeCursor += secsInDay;
        }
    }

    function getBookingOnDate(uint _listingId, uint _dateTime) public view isAtMidnight(_dateTime) returns (uint) {
        return listingsToBookingDates[_listingId][_dateTime];
    }

    function getBookingsInRange(uint _listingId, uint _startTime, uint _endTime) public view isAtMidnight2(_startTime, _endTime) returns (uint[] memory) {
        uint numberOfPossibleBookings = ((_endTime - _startTime) / secsInDay) + 1;
        uint[] memory bookingSubset = new uint[](numberOfPossibleBookings);

        uint timeCursor = _startTime;

        while (timeCursor <= _endTime) {
            uint i = (timeCursor - _startTime) / secsInDay;
            bookingSubset[i] = getBookingOnDate(_listingId, timeCursor);
            timeCursor += secsInDay;
        }

        return bookingSubset;
    }

    function getBookingStart(uint _bookingId) public view returns (uint64) {
        return bookings[_bookingId].startEpochTime;
    }

    function getBookingEnd(uint _bookingId) public view returns (uint64) {
        return bookings[_bookingId].endEpochTime;
    }

    function getBookingOwner(uint _bookingId) public view returns (address) {
        return bookings[_bookingId].owner;
    }
}
