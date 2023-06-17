// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IMXCRoyaltyStandard {
    function royaltyInfo(
        uint256 _salePrice
    )
        external
        view
        returns (
            address receiver,
            uint256 royaltyAmount,
            address royaltyRecipient
        );
}
