// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import {ERC721Upgrade} from "./ERC721Upgrade.sol";

error MXCCollection__NotCreator();
error MXCCollection__NotExistToken();
error MXCCollection__NotAuthorize();
error MXCCollection__NotOwner();

contract MXCCollectionV2Upgrade is UUPSUpgradeable, ERC721Upgrade {
    uint256 private _tokenIdCounter;
    uint256 public totalSupply;

    uint256 public royaltiesCutPerMillion;
    address public royaltyRecipientAddress;
    address public creator;
    uint256 public existSupply;

    mapping(uint256 => string) private _tokenURIs;

    modifier onlyCreator() {
        if (msg.sender != creator) revert MXCCollection__NotCreator();
        _;
    }

    function initialize(
        address _creator,
        address _royaltyRecipient,
        uint256 _royaltiesCutPerMillion,
        string memory _name,
        string memory _symbol
    ) public initializer {
        royaltiesCutPerMillion = _royaltiesCutPerMillion;
        royaltyRecipientAddress = _royaltyRecipient;
        creator = _creator;
        initializeERC721(_name, _symbol);

        __UUPSUpgradeable_init();
    }

    function _authorizeUpgrade(address) internal override {}

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
        _mint(msg.sender, newItemId);
        setTokenURI(newItemId, _tokenURI);
        _tokenIdCounter = _tokenIdCounter + 1;
        totalSupply += 1;
        existSupply += 1;
    }

    function burn(uint256 tokenId) public {
        if (!_isApprovedOrOwner(msg.sender, tokenId)) {
            revert MXCCollection__NotAuthorize();
        }
        _burn(tokenId);
        existSupply -= 1;
    }

    function _isApprovedOrOwner(
        address spender,
        uint256 tokenId
    ) internal view returns (bool) {
        address owner = ERC721Upgrade.ownerOf(tokenId);
        return (spender == owner ||
            isApprovedForAll[owner][spender] ||
            getApproved[tokenId] == spender);
    }

    function setTokenURI(uint256 tokenId, string memory uri) public {
        address owner = ERC721Upgrade.ownerOf(tokenId);
        if (msg.sender != owner) revert MXCCollection__NotOwner();
        _tokenURIs[tokenId] = uri;
    }

    function exists(uint256 tokenId) internal view returns (bool) {
        return ownerOf(tokenId) != address(0);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        if (!exists(tokenId)) {
            revert MXCCollection__NotExistToken();
        }
        return _tokenURIs[tokenId];
    }
}
