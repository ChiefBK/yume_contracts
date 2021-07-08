// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

struct PriceRule {
	uint64 amountInCents;
	bytes3 currency;
	uint64 startEpochTime;
	uint64 endEpochTime;
}
