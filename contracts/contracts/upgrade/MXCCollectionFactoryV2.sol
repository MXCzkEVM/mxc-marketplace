// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./MXCCollectionV2Upgrade.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract MXCCollectionFactoryV2 {
    event newCollectionEvent(
        address indexed collectionAddress,
        address indexed owner
    );

    function createCollection(
        string memory _name,
        string memory _symbol,
        uint256 _royaltiesCutPerMillion,
        address _royaltyRecipient
    ) external returns (address[2] memory) {
        MXCCollectionV2Upgrade newCollection = new MXCCollectionV2Upgrade();
        ERC1967Proxy proxy = new ERC1967Proxy(
            address(newCollection),
            abi.encodeWithSelector(
                newCollection.initialize.selector,
                msg.sender,
                _royaltyRecipient,
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
