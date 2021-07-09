// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import './structs/Booking.sol';
import "./Manager.sol";

contract BookingManager is Manager {
    mapping(uint => Booking) bookings;
    uint public numOfBookings = 0;
    uint public bookingIndex = 1; // bookings start at index 1
    string public name = "Booking Manager";

    // maps a given listing ID (key) to a mapping ZZ.
    // The keys of ZZ are epoch times (at midnight) which map to a booking ID (the value)
    mapping(uint => mapping(uint => uint)) listingsToBookingDates;

    function createBooking(uint _listingId, uint64 _startTime, uint64 _endTime) public isAtMidnight(_startTime, _endTime) returns (uint) {
        uint bookingId = bookingIndex++;

        Booking storage newBooking = bookings[bookingId];
        newBooking.startEpochTime = _startTime;
        newBooking.endEpochTime = _endTime;
        newBooking.owner = msg.sender;

        addBookingDatesToListing(_listingId, _startTime, _endTime, bookingId);
        numOfBookings++;

        return bookingId;
    }

    function addBookingDatesToListing(uint _listingId, uint64 _startTime, uint64 _endTime, uint _bookingId) private isAtMidnight(_startTime, _endTime) {
        uint timeCursor = _startTime;

        while (timeCursor <= _endTime) {
            // If the listing has no booking for the given date
            if (listingsToBookingDates[_listingId][timeCursor] == 0) {
                listingsToBookingDates[_listingId][timeCursor] = _bookingId;
            }
            timeCursor += secsInDay;
        }
    }

    function getBookingOnDate(uint _listingId, uint _dateTime) public view returns (uint) {
        return listingsToBookingDates[_listingId][_dateTime];
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
