// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "../interfaces/IMXCCollection.sol";
import "../interfaces/IMXCName.sol";
import "../interfaces/IMXCDomain.sol";

error MXCMarketplace__NotAdmin();
error MXCMarketplace__NotOwner();
error MXCMarketplace__NotApproveFor();
error MXCMarketplace__PriceNotAllow();
error MXCMarketplace__InvalidExpiresAt();
error MXCMarketplace__UnauthorizedUser();
error MXCMarketplace__InvalidNftAddress();
error MXCMarketplace__InvalidErc721Implementation();
error MXCMarketplace__AssetNotForSale();
error MXCMarketplace__InvalidSeller();
error MXCMarketplace__SenderIsSeller();
error MXCMarketplace__OrderExpired();
error MXCMarketplace__SellerNotOwner();
error MXCMarketplace__PriceMisMatch();

contract MXCMarketPlaceUpgradeV5 is UUPSUpgradeable, IERC721Receiver {
    using Address for address;

    struct Order {
        // Order ID
        bytes32 id;
        // Owner of the NFT
        address seller;
        // NFT registry address
        address nftAddress;
        // Price (in wei) for the published item
        uint256 price;
        // Time when this sale ends
        uint256 expiresAt;
    }

    struct LatestInfo {
        uint256 price;
        uint256 transactions;
    }

    struct collectionMarket {
        uint256 floorPrice;
        uint256 ceilingPrice;
    }

    address public admin;
    // collection => assetId => Order
    mapping(address => mapping(uint256 => Order)) public orderByAssetId;
    // collection => assetId => LatestInfo
    mapping(address => mapping(uint256 => LatestInfo)) public assertPrice;
    // collection => marketInfo
    mapping(address => collectionMarket) public collectionMarketInfo;

    bytes4 public constant ERC721_Interface = bytes4(0x80ac58cd);

    address public nameToken;
    address public domainToken;

    // EVENTS
    event OrderCreated(
        bytes32 id,
        uint256 indexed assetId,
        address indexed seller,
        address nftAddress,
        uint256 priceInWei,
        uint256 expiresAt
    );
    event OrderCancelled(
        bytes32 id,
        uint256 indexed assetId,
        address indexed seller,
        address nftAddress
    );
    event OrderSuccessful(
        bytes32 id,
        uint256 indexed assetId,
        address indexed seller,
        address nftAddress,
        uint256 totalPrice,
        address indexed buyer
    );

    modifier onlyAdmin() {
        if (msg.sender != admin) revert MXCMarketplace__NotAdmin();
        _;
    }

    function initialize() public initializer {
        admin = msg.sender;
        __UUPSUpgradeable_init();
    }

    function _authorizeUpgrade(address) internal override onlyAdmin {}

    function onERC721Received(
        address /* operator */,
        address /* from */,
        uint256 /* tokenId */,
        bytes calldata /* data */
    ) external pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    function setNameToken(address _nameToken) public onlyAdmin {
        nameToken = _nameToken;
    }

    function setDoaminToken(address _domainToken) public onlyAdmin {
        domainToken = _domainToken;
    }

    function _ensureApproval(
        address assetOwner,
        address nftAddress,
        uint256 assetId
    ) internal view {
        IERC721 token = IERC721(nftAddress);

        if (
            msg.sender != assetOwner &&
            !token.isApprovedForAll(msg.sender, address(this)) &&
            token.getApproved(assetId) != address(this)
        ) {
            revert MXCMarketplace__NotApproveFor();
        }
    }

    function _validateOrder(
        uint256 priceInWei,
        uint256 expiresAt
    ) internal view {
        if (priceInWei <= 0) {
            revert MXCMarketplace__PriceNotAllow();
        }

        if (expiresAt <= block.timestamp + 1 minutes) {
            revert MXCMarketplace__InvalidExpiresAt();
        }
    }

    function createOrder(
        address nftAddress,
        uint256 assetId,
        uint256 priceInWei,
        uint256 expiresAt
    ) external {
        if (nftAddress != nameToken && nftAddress != domainToken) {
            _requireERC721(nftAddress);
        }

        address assetOwner = _assetOwner(nftAddress, assetId);

        _ensureApproval(assetOwner, nftAddress, assetId);
        _validateOrder(priceInWei, expiresAt);

        bytes32 orderId = keccak256(
            abi.encodePacked(
                block.timestamp,
                assetOwner,
                assetId,
                nftAddress,
                priceInWei
            )
        );

        orderByAssetId[nftAddress][assetId] = Order({
            id: orderId,
            seller: assetOwner,
            nftAddress: nftAddress,
            price: priceInWei,
            expiresAt: expiresAt
        });

        emit OrderCreated(
            orderId,
            assetId,
            assetOwner,
            nftAddress,
            priceInWei,
            expiresAt
        );
    }

    function cancelOrder(
        address nftAddress,
        uint256 assetId
    ) external returns (Order memory) {
        address sender = msg.sender;

        if (
            sender != orderByAssetId[nftAddress][assetId].seller &&
            sender != admin
        ) {
            revert MXCMarketplace__UnauthorizedUser();
        }

        Order memory order = orderByAssetId[nftAddress][assetId];
        bytes32 orderId = order.id;
        address orderSeller = order.seller;
        delete orderByAssetId[nftAddress][assetId];

        emit OrderCancelled(orderId, assetId, orderSeller, nftAddress);

        return order;
    }

    function executeOrder(
        address nftAddress,
        uint256 assetId
    ) external payable {
        _requireERC721(nftAddress);

        Order memory order = orderByAssetId[nftAddress][assetId];

        if (order.id == 0) {
            revert MXCMarketplace__AssetNotForSale();
        }

        if (order.seller == msg.sender) {
            revert MXCMarketplace__SenderIsSeller();
        }
        if (block.timestamp >= order.expiresAt) {
            revert MXCMarketplace__OrderExpired();
        }

        IMXCCollection mxcToken = IMXCCollection(nftAddress);
        if (order.seller != mxcToken.ownerOf(assetId)) {
            revert MXCMarketplace__SellerNotOwner();
        }

        if (msg.value != order.price) {
            revert MXCMarketplace__PriceMisMatch();
        }

        // send royalty fee to nft creator
        (uint256 royaltyAmount, address royaltyRecipient) = mxcToken
            .royaltyInfo(order.price);
        payable(royaltyRecipient).transfer(royaltyAmount);

        // send left to seller
        payable(order.seller).transfer(order.price - royaltyAmount);
        // send nft to buyer
        mxcToken.safeTransferFrom(order.seller, msg.sender, assetId);

        // update new transaction
        uint256 transactions = assertPrice[nftAddress][assetId].transactions;
        assertPrice[nftAddress][assetId] = LatestInfo(
            order.price,
            transactions + 1
        );

        // update collection marketplace info
        uint256 floorPrice = collectionMarketInfo[nftAddress].floorPrice;
        uint256 ceilingPrice = collectionMarketInfo[nftAddress].ceilingPrice;

        if (transactions == 0) {
            floorPrice = order.price;
            ceilingPrice = order.price;
        } else if (order.price < floorPrice) {
            floorPrice = order.price;
        } else if (order.price > ceilingPrice) {
            ceilingPrice = order.price;
        }

        collectionMarketInfo[nftAddress] = collectionMarket(
            floorPrice,
            ceilingPrice
        );

        delete orderByAssetId[nftAddress][assetId];

        emit OrderSuccessful(
            order.id,
            assetId,
            order.seller,
            nftAddress,
            order.price,
            msg.sender
        );
    }

    function executeOrderByErc721(address nftAddress, uint256 assetId) external payable {
      _verifyOrder(nftAddress, assetId);

      Order memory order = orderByAssetId[nftAddress][assetId];
      IERC721 token = IERC721(nftAddress);

      payable(order.seller).transfer(order.price);
      token.safeTransferFrom(order.seller, msg.sender, assetId);

      _finishOrder(order, nftAddress, assetId);
    }

    function executeOrderByErc1155(address nftAddress, uint256 assetId) external payable {
      _verifyOrder(nftAddress, assetId);

      Order memory order = orderByAssetId[nftAddress][assetId];
      IERC1155 token = IERC1155(nftAddress);

      payable(order.seller).transfer(order.price);
      token.safeTransferFrom(order.seller, msg.sender, assetId, 1, "");

      _finishOrder(order, nftAddress, assetId);
    }

    function _requireERC721(address nftAddress) internal view {
        if (!nftAddress.isContract()) {
            revert MXCMarketplace__InvalidNftAddress();
        }

        IERC721 nftRegistry = IERC721(nftAddress);
        if (!nftRegistry.supportsInterface(ERC721_Interface)) {
            revert MXCMarketplace__InvalidErc721Implementation();
        }
    }

    function _assetOwner(address nftAddress, uint256 assetId) internal view returns (address) {
      if (nftAddress == domainToken)
        return IMXCDomain(domainToken).ownerOf(assetId);
      else
        return IERC721(nftAddress).ownerOf(assetId);
    }

    function _verifyOrder(address nftAddress, uint256 assetId) internal view {
        Order memory order = orderByAssetId[nftAddress][assetId];

        if (order.id == 0) {
            revert MXCMarketplace__AssetNotForSale();
        }

        if (order.seller == msg.sender) {
            revert MXCMarketplace__SenderIsSeller();
        }
        
        if (block.timestamp >= order.expiresAt) {
            revert MXCMarketplace__OrderExpired();
        }

        if (order.seller != _assetOwner(nftAddress, assetId)) {
            revert MXCMarketplace__SellerNotOwner();
        }

        if (msg.value != order.price) {
            revert MXCMarketplace__PriceMisMatch();
        }
    }

    function _finishOrder(Order memory order, address nftAddress, uint256 assetId) internal {
      delete orderByAssetId[nftAddress][assetId];
      emit OrderSuccessful(
        order.id,
        assetId,
        order.seller,
        nftAddress,
        order.price,
        msg.sender
      );
    }
}
