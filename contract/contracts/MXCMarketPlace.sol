// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IMXCCollection.sol";

error MXCMarketplace__NotOwner();
error MXCMarketplace__NotApproveFor();
error MXCMarketplace__PriceNotAllow();
error MXCMarketplace__InvalidExpiresAt();
error MXCMarketplace__InvalidOrder();
error MXCMarketplace__UnauthorizedUser();
error MXCMarketplace__InvalidNftAddress();
error MXCMarketplace__InvalidErc721Implementation();
error MXCMarketplace__AssetNotForSale();
error MXCMarketplace__InvalidSeller();
error MXCMarketplace__SenderIsSeller();
error MXCMarketplace__OrderExpired();
error MXCMarketplace__SellerNotOwner();
error MXCMarketplace__PriceMisMatch();
error MXCMarketplace__OrderExisted();

contract MXCMarketplace is IERC721Receiver, Ownable {
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

    // collection => assetId => Order
    mapping(address => mapping(uint256 => Order)) public orderByAssetId;
    // collection => assetId => LatestInfo
    mapping(address => mapping(uint256 => LatestInfo)) public assertPrice;
    // collection => marketInfo
    mapping(address => collectionMarket) public collectionMarketInfo;

    bytes4 public constant ERC721_Interface = bytes4(0x80ac58cd);

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

    function onERC721Received(
        address /* operator */,
        address /* from */,
        uint256 /* tokenId */,
        bytes calldata /* data */
    ) external pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    function createOrder(
        address nftAddress,
        uint256 assetId,
        uint256 priceInWei,
        uint256 expiresAt
    ) external {
        _requireERC721(nftAddress);

        IERC721 token = IERC721(nftAddress);
        address assetOwner = token.ownerOf(assetId);

        if (
            msg.sender != assetOwner &&
            !token.isApprovedForAll(msg.sender, address(this)) &&
            token.getApproved(assetId) != address(this)
        ) {
            revert MXCMarketplace__NotApproveFor();
        }

        if (priceInWei <= 0) {
            revert MXCMarketplace__PriceNotAllow();
        }

        if (expiresAt <= block.timestamp + 1 minutes) {
            revert MXCMarketplace__InvalidExpiresAt();
        }

        Order memory order = orderByAssetId[nftAddress][assetId];
        if (order.price > 0) {
            revert MXCMarketplace__OrderExisted();
        }

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
        address sender = _msgSender();
        Order memory order = orderByAssetId[nftAddress][assetId];

        if (order.id == 0) {
            revert MXCMarketplace__InvalidOrder();
        }
        // can only be canceled by seller or the contract owner
        if (order.seller != sender && sender != owner()) {
            revert MXCMarketplace__UnauthorizedUser();
        }

        bytes32 orderId = order.id;
        address orderSeller = order.seller;
        address orderNftAddress = order.nftAddress;
        delete orderByAssetId[nftAddress][assetId];

        emit OrderCancelled(orderId, assetId, orderSeller, orderNftAddress);

        return order;
    }

    function executeOrder(
        address nftAddress,
        uint256 assetId
    ) external payable {
        _requireERC721(nftAddress);
        IMXCCollection mxcToken = IMXCCollection(nftAddress);
        address sender = _msgSender();
        Order memory order = orderByAssetId[nftAddress][assetId];

        if (order.id == 0) {
            revert MXCMarketplace__AssetNotForSale();
        }
        if (order.seller == address(0)) {
            revert MXCMarketplace__InvalidSeller();
        }
        if (order.seller == sender) {
            revert MXCMarketplace__SenderIsSeller();
        }
        if (block.timestamp >= order.expiresAt) {
            revert MXCMarketplace__OrderExpired();
        }
        if (order.seller != mxcToken.ownerOf(assetId)) {
            revert MXCMarketplace__SellerNotOwner();
        }
        if (msg.value != order.price) {
            revert MXCMarketplace__PriceMisMatch();
        }

        delete orderByAssetId[nftAddress][assetId];

        // send royalty fee to nft creator
        (uint256 royaltyAmount, address royaltyRecipient) = mxcToken
            .royaltyInfo(order.price);

        payable(royaltyRecipient).transfer(royaltyAmount);
        // send left to seller
        payable(order.seller).transfer(order.price - royaltyAmount);
        // send nft to buyer
        mxcToken.safeTransferFrom(order.seller, sender, assetId);
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
        }
        if (order.price < floorPrice) {
            floorPrice = order.price;
        }
        if (order.price > ceilingPrice) {
            ceilingPrice = order.price;
        }
        collectionMarketInfo[nftAddress] = collectionMarket(
            floorPrice,
            ceilingPrice
        );

        emit OrderSuccessful(
            order.id,
            assetId,
            order.seller,
            nftAddress,
            order.price,
            sender
        );
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
}
