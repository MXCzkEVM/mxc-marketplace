// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./MXCCollection.sol";

error MXCCollectionFactory__NotOwner();

contract MXCCollectionFactory {
    struct MXCCollectionData {
        string ipfs;
        address owner;
        address mxcCollection;
    }

    MXCCollectionData[] public collections;

    function createCollection(
        address _marketplaceAddress,
        string memory _name,
        string memory _symbol,
        uint256 _royaltiesCutPerMillion,
        address _royaltyRecipient,
        string memory _ipfs
    ) external {
        address newCollection = address(
            new MXCCollection(
                msg.sender,
                _marketplaceAddress,
                _name,
                _symbol,
                _royaltiesCutPerMillion,
                _royaltyRecipient
            )
        );

        collections.push(MXCCollectionData(_ipfs, msg.sender, newCollection));
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

    function delCollection(string memory _ipfs) external {
        for (uint256 i = 0; i < collections.length; i++) {
            if (collections[i].owner != msg.sender) {
                revert MXCCollectionFactory__NotOwner();
            }
            if (compareStrings(collections[i].ipfs, _ipfs)) {
                // move last one and delete it
                collections[i] = collections[collections.length - 1];
                collections.pop();
                return;
            }
        }
    }

    function compareStrings(
        string memory a,
        string memory b
    ) private pure returns (bool) {
        return (keccak256(abi.encodePacked(a)) ==
            keccak256(abi.encodePacked(b)));
    }
}
