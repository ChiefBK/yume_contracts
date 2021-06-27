// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./structs/Property.sol";

contract PropertyManager {
    mapping(uint => Property) properties;

    uint public numOfProperties = 0;
    address public owner;
    string public name = "Property Manager";

    constructor() {
        owner = msg.sender;
    }

    function createProperty(
        string memory _city,
        string memory _state,
        uint8 _numOfBedrooms,
        uint8 _numOfFullBathrooms,
        uint8 _numOfHalfBathrooms,
        uint8 _numOfKingBeds,
        uint8 _numOfQueenBeds,
        uint8 _numOfFullBeds,
        uint8 _numOfTwinBeds,
        uint32 _sqFootage,
        uint8 _maxNumOfGuests
    ) public returns (uint) {
        Property storage property = properties[numOfProperties++];
        property.city = _city;
        property.state = _state;
        property.numOfBedrooms = _numOfBedrooms;
        property.numOfFullBathrooms = _numOfFullBathrooms;
        property.numOfHalfBathrooms = _numOfHalfBathrooms;
        property.numOfKingBeds = _numOfKingBeds;
        property.numOfQueenBeds = _numOfQueenBeds;
        property.numOfFullBeds = _numOfFullBeds;
        property.numOfTwinBeds = _numOfTwinBeds;
        property.sqFootage = _sqFootage;
        property.maxNumOfGuests = _maxNumOfGuests;

        return numOfProperties - 1;
    }

    function getPropertyCity(uint _propertyId) public view returns (string memory) {
        return properties[_propertyId].city;
    }

    function getPropertyState(uint _propertyId) public view returns (string memory) {
        return properties[_propertyId].state;
    }

    function getPropertyBedrooms(uint _propertyId) public view returns (uint8) {
        return properties[_propertyId].numOfBedrooms;
    }

    function getPropertyFullBaths(uint _propertyId) public view returns (uint8) {
        return properties[_propertyId].numOfFullBathrooms;
    }

    function getPropertyHalfBaths(uint _propertyId) public view returns (uint8) {
        return properties[_propertyId].numOfHalfBathrooms;
    }

    function getPropertyKingBeds(uint _propertyId) public view returns (uint8) {
        return properties[_propertyId].numOfKingBeds;
    }

    function getPropertyQueenBeds(uint _propertyId) public view returns (uint8) {
        return properties[_propertyId].numOfQueenBeds;
    }

    function getPropertyFullBeds(uint _propertyId) public view returns (uint8) {
        return properties[_propertyId].numOfFullBeds;
    }

    function getPropertyTwinBeds(uint _propertyId) public view returns (uint8) {
        return properties[_propertyId].numOfTwinBeds;
    }

    function getPropertySqFootage(uint _propertyId) public view returns (uint32) {
        return properties[_propertyId].sqFootage;
    }

    function getPropertyMaxGuests(uint _propertyId) public view returns (uint8) {
        return properties[_propertyId].maxNumOfGuests;
    }
}
