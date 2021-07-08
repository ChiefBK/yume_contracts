// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

library DateTime {
    // Verifies that both times occur at midnight of any day
    // _time1: epoch time
    // _time2: epoch time
    function verifyMidnight(uint _time1, uint _time2) public pure {
        uint secsInDay = 86400;

        require(_time1 % secsInDay == 0);
        require(_time2 % secsInDay == 0);
    }
}
