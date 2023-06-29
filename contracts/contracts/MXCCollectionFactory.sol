// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./MXCCollectionV2.sol";

error MXCCollectionFactory__NotOwner();
error MXCCollectionFactory__NotFound();
error MXCCollectionFactory__NotAdmin();

contract MXCCollectionFactory {
    struct MXCCollectionData {
        string ipfs;
        address owner;
        address collection;
    }
    address public admin;
    MXCCollectionData[] public collections;
    mapping(address => uint256[]) private userToCollections;

    event newCollectionEvent(
        address indexed collectionAddress,
        address indexed owner
    );
    event editCollectionEvent(
        address indexed collectionAddress,
        address indexed owner
    );
    event delCollectionEvent(
        address indexed collectionAddress,
        address indexed owner
    );

    constructor(address _admin) {
        admin = _admin;
    }

    function createCollection(
        string memory _name,
        string memory _symbol,
        uint256 _royaltiesCutPerMillion,
        address _royaltyRecipient,
        string memory _ipfs
    ) external returns (address) {
        address newCollection = address(
            new MXCCollectionV2(
                msg.sender,
                _royaltyRecipient,
                _royaltiesCutPerMillion,
                _name,
                _symbol
            )
        );

        collections.push(MXCCollectionData(_ipfs, msg.sender, newCollection));
        uint256 index = collections.length - 1;
        userToCollections[msg.sender].push(index);
        emit newCollectionEvent(newCollection, msg.sender);
        return newCollection;
    }

    function editCollection(address _collection, string memory _ipfs) external {
        for (uint256 i = 0; i < collections.length; i++) {
            if (collections[i].collection == _collection) {
                if (collections[i].owner != msg.sender) {
                    revert MXCCollectionFactory__NotOwner();
                }
                MXCCollectionData storage target = collections[i];
                target.ipfs = _ipfs;
                emit editCollectionEvent(_collection, msg.sender);
            }
        }
    }

    function delCollection(address _collection) external returns (address) {
        for (uint256 i = 0; i < collections.length; i++) {
            address collection = collections[i].collection;
            if (collection == _collection) {
                if (collections[i].owner != msg.sender) {
                    revert MXCCollectionFactory__NotOwner();
                }
                collections[i] = collections[collections.length - 1];
                collections.pop();
                emit delCollectionEvent(collection, msg.sender);
                return collection;
            }
        }
        revert MXCCollectionFactory__NotFound();
    }

    function fetchCollection(
        address _collection
    ) public view returns (MXCCollectionData memory) {
        for (uint256 i = 0; i < collections.length; i++) {
            address collection = collections[i].collection;
            if (collection == _collection) {
                return collections[i];
            }
        }
        return MXCCollectionData("", address(0), address(0));
    }

    function fetchUserCollections(
        address _user
    ) public view returns (MXCCollectionData[] memory) {
        uint256[] storage indices = userToCollections[_user];
        MXCCollectionData[] memory result = new MXCCollectionData[](
            indices.length
        );
        for (uint i = 0; i < indices.length; i++) {
            result[i] = collections[indices[i]];
        }
        return result;
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
}
