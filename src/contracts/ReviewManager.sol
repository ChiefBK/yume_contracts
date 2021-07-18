// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./Manager.sol";
import "./structs/Review.sol";
import "./BookingManager.sol";

/*
  This contract is unused and not deployed. This is because I figured guests would not want to pay to post a review.
  Instead reviews will be hosted on our own servers. However the guest will have to sign the review with their private
  key to confirm that they were the one who created the booking being reviewed.
*/

contract ReviewManager is Manager {
    mapping(uint => Review) reviews;
    uint public numOfReviews = 0;
    uint public reviewIndex = 1;
    string public name = "Review Manager";

    BookingManager bookingManger;

    constructor(BookingManager _bookingManager) {
        bookingManger = _bookingManager;
    }

    modifier ownsBooking(uint bookingId) {
        require(bookingManger.getBookingOwner(bookingId) == msg.sender);
        _;
    }

    function createReview(
        uint _bookingId,
        uint8 _starRating,
        string memory _positiveComments,
        string memory _negativeComments,
        string memory _otherComments
    ) public ownsBooking(_bookingId) returns (uint) {
        uint reviewId = reviewIndex++;

        Review storage newReview = reviews[reviewId];
        newReview.starRating = _starRating;
        newReview.bookingId = _bookingId;
        newReview.guestId = msg.sender;
        newReview.positiveComments = _positiveComments;
        newReview.negativeComments = _negativeComments;
        newReview.otherComments = _otherComments;

        numOfReviews++;

        return reviewId;
    }
}
