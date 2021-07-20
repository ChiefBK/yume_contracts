// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

struct PriceRule {
	bytes3 currency;
	uint64 amountInCents;
	uint64 startEpochTime;
	uint64 endEpochTime;
	uint amountInWei;
}
