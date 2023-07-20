// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IMXCDomain {
    function ownerOf(uint256 id) external view returns (address);

    function isApprovedForAll(
        address account,
        address operator
    ) external view returns (bool) ;

    function getApproved(
        uint256 tokenId
    ) external view returns (address);

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) external;
}
