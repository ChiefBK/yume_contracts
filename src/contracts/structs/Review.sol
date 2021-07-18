// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

struct Review {
    uint8 starRating;
    uint bookingId;
    address guestId;
    string positiveComments;
    string negativeComments;
    string otherComments;
}
