// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./MXCCollectionV5Upgrade.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract MXCCollectionFactoryV5 {

    event newCollectionEvent(
        address indexed collectionAddress,
        address indexed owner
    );

    function createCollection(
        string memory _name,
        string memory _symbol,
        uint256 _royaltiesCutPerMillion,
        address _royaltyRecipient,
        address _collateral
    ) external returns (address[2] memory) {
        MXCCollectionV5Upgrade newCollection = new MXCCollectionV5Upgrade();
        ERC1967Proxy proxy = new ERC1967Proxy(
            address(newCollection),
            abi.encodeWithSelector(
                newCollection.initialize.selector,
                msg.sender,
                _royaltyRecipient,
                _collateral,
                _royaltiesCutPerMillion,
                _name,
                _symbol
            )
        );

        address prxoyAddress = address(proxy);
        emit newCollectionEvent(prxoyAddress, msg.sender);
        return [prxoyAddress, msg.sender];
    }
}
