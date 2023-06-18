// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./MXCCollection.sol";

error MXCCollectionFactory__NotOwner();

contract MXCCollectionFactory {
    struct MXCCollectionData {
        string ipfs;
        address owner;
        MXCCollection mxcColelction;
    }
    mapping(string => MXCCollection) public ipfsToCollection;

    MXCCollectionData[] public collections;

    constructor() {}

    function createCollection(
        address _marketplaceAddress,
        string memory _name,
        string memory _symbol,
        uint256 _royaltiesCutPerMillion,
        address _royaltyRecipient,
        string memory _ipfs
    ) external {
        MXCCollection newCollection = new MXCCollection(
            _marketplaceAddress,
            _name,
            _symbol,
            _royaltiesCutPerMillion,
            _royaltyRecipient
        );
        ipfsToCollection[_ipfs] = newCollection;
        collections.push(MXCCollectionData(_ipfs, msg.sender, newCollection));
    }

    function fetchUserCollection(
        address _user
    ) external view returns (MXCCollectionData[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < collections.length; i++) {
            if (collections[i].owner == _user) {
                count++;
            }
        }
        MXCCollectionData[] memory userCollections = new MXCCollectionData[](
            count
        );
        uint256 index = 0;
        for (uint256 i = 0; i < collections.length; i++) {
            if (collections[i].owner == _user) {
                userCollections[index] = collections[i];
                index++;
            }
        }

        return userCollections;
    }

    function delCollection(string memory _ipfs) external {
        delete ipfsToCollection[_ipfs];

        for (uint256 i = 0; i < collections.length; i++) {
            if (collections[i].owner != msg.sender) {
                revert MXCCollectionFactory__NotOwner();
            }
            if (compareStrings(collections[i].ipfs, _ipfs)) {
                // 将最后一个元素移到当前位置，然后删除最后一个元素
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
