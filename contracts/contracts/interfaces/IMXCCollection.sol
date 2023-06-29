// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IMXCCollection {
    function ownerOf(uint256 tokenId) external view returns (address);

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    function royaltyInfo(
        uint256 _salePrice
    ) external view returns (uint256 royaltyAmount, address royaltyRecipient);
}
