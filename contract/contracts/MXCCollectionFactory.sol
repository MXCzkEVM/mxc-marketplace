// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./MXCCollection.sol";

error MXCCollectionFactory__NotOwner();

contract MXCCollectionFactory {
    struct MXCCollectionData {
        string ipfs;
        address owner;
        address collection;
    }

    MXCCollectionData[] public collections;

    event newCollectionEvent(
        address indexed collectionAddress,
        address indexed owner
    );
    event delCollectionEvent(
        address indexed collectionAddress,
        address indexed owner
    );

    function createCollection(
        address _marketplaceAddress,
        string memory _name,
        string memory _symbol,
        uint256 _royaltiesCutPerMillion,
        address _royaltyRecipient,
        string memory _ipfs
    ) external returns (address) {
        address newCollection = address(
            new MXCCollection(
                msg.sender,
                _marketplaceAddress,
                _royaltyRecipient,
                _royaltiesCutPerMillion,
                _name,
                _symbol
            )
        );

        collections.push(MXCCollectionData(_ipfs, msg.sender, newCollection));
        emit newCollectionEvent(newCollection, msg.sender);
        return newCollection;
    }

    function fetchCollections()
        public
        view
        returns (MXCCollectionData[] memory)
    {
        return collections;
    }

    function fetchCollectionsLength() public view returns (uint256) {
        return collections.length;
    }

    function delCollection(string memory _ipfs) external returns (address) {
        for (uint256 i = 0; i < collections.length; i++) {
            if (collections[i].owner != msg.sender) {
                revert MXCCollectionFactory__NotOwner();
            }
            if (compareStrings(collections[i].ipfs, _ipfs)) {
                address collection = collections[i].collection;
                collections[i] = collections[collections.length - 1];
                collections.pop();
                emit delCollectionEvent(collection, msg.sender);
                return collection;
            }
        }
        return address(0);
    }

    function compareStrings(
        string memory a,
        string memory b
    ) private pure returns (bool) {
        return (keccak256(abi.encodePacked(a)) ==
            keccak256(abi.encodePacked(b)));
    }
}
