// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import './libraries/DateTime.sol';

contract Manager {
    uint secsInDay = 86400;

    modifier isAtMidnight2(uint _time1, uint _time2) {
        DateTime.verifyMidnight(_time1, _time2);
        _;
    }

    modifier isAtMidnight(uint _time1) {
        DateTime.verifyMidnight(_time1);
        _;
    }
}
