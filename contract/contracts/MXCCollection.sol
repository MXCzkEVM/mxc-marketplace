// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MXCCollection is ERC721, ERC721URIStorage, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdTracker;
    uint256 public royaltiesCutPerMillion;
    address public royaltyRecipientAddress;
    address public marketplaceContract;

    constructor(
        address _mpAddress,
        string memory _name,
        string memory _symbol,
        uint256 _royaltiesCutPerMillion,
        address _royaltyRecipient
    ) ERC721(_name, _symbol) {
        marketplaceContract = _mpAddress;
        royaltiesCutPerMillion = _royaltiesCutPerMillion;
        royaltyRecipientAddress = _royaltyRecipient;
    }

    function royaltyInfo(
        uint256 _salePrice
    )
        external
        view
        returns (
            address receiver,
            uint256 royaltyAmount,
            address royaltyRecipient
        )
    {
        if (royaltiesCutPerMillion > 0) {
            return (
                owner(),
                (_salePrice * royaltiesCutPerMillion) / 10000,
                royaltyRecipientAddress
            );
        } else {
            return (address(0), 0, address(0));
        }
    }

    function safeMint(address to, string memory _tokenURI) public onlyOwner {
        uint256 newItemId = _tokenIdTracker.current() + 1;
        _safeMint(to, newItemId);
        _setTokenURI(newItemId, _tokenURI);
        setApprovalForAll(marketplaceContract, true);
        _tokenIdTracker.increment();
    }

    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokensOfOwner(
        address _owner
    ) public view returns (uint256[] memory) {
        uint256 count = balanceOf(_owner);
        uint256[] memory result = new uint256[](count);
        for (uint256 index = 0; index < count; index++) {
            result[index] = tokenOfOwnerByIndex(_owner, index);
        }
        return result;
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        return super.tokenURI(tokenId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {}

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
