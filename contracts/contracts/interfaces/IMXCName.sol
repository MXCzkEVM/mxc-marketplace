// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IMXCName {
    function ownerOf(uint256 tokenId) external view returns (address);

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;
}
