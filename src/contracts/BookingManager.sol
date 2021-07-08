// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import './structs/Booking.sol';
import "./Manager.sol";

contract BookingManager is Manager {
    mapping(uint => Booking) bookings;
    uint public numOfBookings = 0;

    // maps a given listing ID (key) to a mapping ZZ.
    // The keys of ZZ are epoch times (at midnight) which map to a booking ID (the value)
    mapping(uint => mapping(uint => uint)) listingsToBookingDates;

    function createBooking(uint _listingId, uint64 _startTime, uint64 _endTime) public isAtMidnight(_startTime, _endTime) returns (uint) {
        uint bookingId = numOfBookings++;

        Booking storage newBooking = bookings[bookingId];
        newBooking.startEpochTime = _startTime;
        newBooking.endEpochTime = _startTime;
        newBooking.owner = msg.sender;

        addBookingDatesToListing(_listingId, _startTime, _endTime, bookingId);

        return bookingId;
    }

    function addBookingDatesToListing(uint _listingId, uint64 _startTime, uint64 _endTime, uint _bookingId) private isAtMidnight(_startTime, _endTime) {
        uint timeCursor = _startTime;

        while (timeCursor <= _endTime) {
            listingsToBookingDates[_listingId][timeCursor] = _bookingId;
            timeCursor += secsInDay;
        }
    }
}
