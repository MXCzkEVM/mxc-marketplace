// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

error MXCCollection__NotCreator();
error MXCCollection__NotExistToken();

contract MXCCollection is ERC721, ERC721Enumerable, ERC721URIStorage {
    uint256 private _tokenIdCounter;
    uint256 public royaltiesCutPerMillion;
    address public royaltyRecipientAddress;
    address public marketplaceContract;
    address public creator;

    constructor(
        address _creator,
        address _mpAddress,
        address _royaltyRecipient,
        uint256 _royaltiesCutPerMillion,
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        marketplaceContract = _mpAddress;
        royaltiesCutPerMillion = _royaltiesCutPerMillion;
        royaltyRecipientAddress = _royaltyRecipient;
        creator = _creator;
    }

    modifier onlyCreator() {
        if (msg.sender != creator) revert MXCCollection__NotCreator();
        _;
    }

    function royaltyInfo(
        uint256 _salePrice
    ) external view returns (uint256 royaltyAmount, address royaltyRecipient) {
        if (royaltiesCutPerMillion > 0) {
            return (
                (_salePrice * royaltiesCutPerMillion) / 10000,
                royaltyRecipientAddress
            );
        } else {
            return (0, address(0));
        }
    }

    function mint(string memory _tokenURI) public onlyCreator {
        uint256 newItemId = _tokenIdCounter;
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, _tokenURI);
        setApprovalForAll(marketplaceContract, true);
        _tokenIdCounter = _tokenIdCounter + 1;
    }

    function burn(uint256 tokenId) public {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "Caller is not owner nor approved"
        );
        _burn(tokenId);
    }

    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        if (!_exists(tokenId)) {
            revert MXCCollection__NotExistToken();
        }
        return super.tokenURI(tokenId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
