// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./MXCCollection.sol";

contract MXCCollectionFactory {
    MXCCollection[] public collectionAddressByIndex;
    event newCollectionEvent(
        address collectionAddress,
        string name,
        address owner,
        string symbol
    );

    constructor() {}

    function createCollection(
        address _marketplaceAddress,
        string memory _name,
        string memory _symbol,
        uint256 _royaltyPercentage,
        address _royaltyRecipient
    ) external {
        MXCCollection newCollection = new MXCCollection(
            _marketplaceAddress,
            _name,
            _symbol,
            _royaltyPercentage,
            _royaltyRecipient
        );
        collectionAddressByIndex.push(newCollection);
        emit newCollectionEvent(
            address(newCollection),
            _name,
            msg.sender,
            _symbol
        );
    }
}
