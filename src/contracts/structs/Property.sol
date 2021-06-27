// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

struct Property {
    string city;
    string state;
    uint8 numOfBedrooms;
    uint8 numOfFullBathrooms;
    uint8 numOfHalfBathrooms;
    uint8 numOfKingBeds;
    uint8 numOfQueenBeds;
    uint8 numOfFullBeds;
    uint8 numOfTwinBeds;
    uint32 sqFootage;
    uint8 maxNumOfGuests;
}
