// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./interfaces/IMXCCollection.sol";

error MXCMarketplace_NotOwner();
error MXCMarketplace_NotApproveFor();
error MXCMarketplace_PriceNotAllow();
error MXCMarketplace_InvalidExpiresAt();
error MXCMarketplace_InvalidOrder();
error MXCMarketplace_UnauthorizedUser();
error MXCMarketplace_InvalidNftAddress();
error MXCMarketplace_InvalidErc721Implementation();
error MXCMarketplace_AssetNotForSale();
error MXCMarketplace_InvalidSeller();
error MXCMarketplace_SenderIsSeller();
error MXCMarketplace_OrderExpired();
error MXCMarketplace_SellerNotOwner();

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

    mapping(address => mapping(uint256 => Order)) public orderByAssetId;

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

        if (msg.sender != assetOwner) {
            revert MXCMarketplace_NotOwner();
        }

        if (
            !token.isApprovedForAll(msg.sender, address(this)) &&
            token.getApproved(assetId) == address(this)
        ) {
            revert MXCMarketplace_NotApproveFor();
        }

        if (priceInWei <= 0) {
            revert MXCMarketplace_PriceNotAllow();
        }

        if (expiresAt <= block.timestamp + 1 minutes) {
            revert MXCMarketplace_InvalidExpiresAt();
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
            revert MXCMarketplace_InvalidOrder();
        }
        // can only be canceled by seller or the contract owner
        if (order.seller != sender && sender != owner()) {
            revert MXCMarketplace_UnauthorizedUser();
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
            revert MXCMarketplace_AssetNotForSale();
        }
        if (order.seller == address(0)) {
            revert MXCMarketplace_InvalidSeller();
        }
        if (order.seller == sender) {
            revert MXCMarketplace_SenderIsSeller();
        }
        if (block.timestamp >= order.expiresAt) {
            revert MXCMarketplace_OrderExpired();
        }
        if (order.seller != mxcToken.ownerOf(assetId)) {
            revert MXCMarketplace_SellerNotOwner();
        }

        delete orderByAssetId[nftAddress][assetId];

        // send royalty fee to nft creator
        (, uint256 royaltyAmount, address royaltyRecipient) = mxcToken
            .royaltyInfo(order.price);
        payable(royaltyRecipient).transfer(royaltyAmount);
        // send left to seller
        payable(order.seller).transfer(order.price - royaltyAmount);
        // send nft to buyer
        mxcToken.safeTransferFrom(order.seller, sender, assetId);
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
            revert MXCMarketplace_InvalidNftAddress();
        }

        IERC721 nftRegistry = IERC721(nftAddress);
        if (!nftRegistry.supportsInterface(ERC721_Interface)) {
            revert MXCMarketplace_InvalidErc721Implementation();
        }
    }
}
