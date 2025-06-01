// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./AssetNFT.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Marketplace is Ownable, ReentrancyGuard {
    AssetNFT public assetNFT;

    enum OfferStatus { Open, Funded, Cancelled, Executed }

    struct Listing {
        uint256 tokenId;
        address owner;
        uint256 price;
        bool listed;
    }

    struct Offer {
        uint256 offerId;
        uint256 tokenId;
        address buyer;
        uint256 price;
        uint256 interestRate; // APR %
        uint256 duration; // seconds
        uint256 amountRaised;
        OfferStatus status;
        address[] lenders;
    }

    uint256 public nextOfferId;
    mapping(uint256 => Listing) public listings;
    mapping(uint256 => Offer) public offers;
    mapping(uint256 => uint256[]) public assetOffers;
    mapping(uint256 => mapping(address => uint256)) public contributions;

    event AssetListed(uint256 indexed tokenId, address indexed owner, uint256 price);
    event AssetUnlisted(uint256 indexed tokenId);
    event OfferCreated(uint256 indexed offerId, uint256 indexed tokenId, address indexed buyer, uint256 price, uint256 interestRate, uint256 duration);
    event OfferFunded(uint256 indexed offerId, address indexed lender, uint256 amount);
    event OfferExecuted(uint256 indexed offerId);
    event OwnershipTransferred(uint256 indexed tokenId, address indexed from, address indexed to);

    constructor(address assetNFT_, address initialOwner) {
        assetNFT = AssetNFT(assetNFT_);
        _transferOwnership(initialOwner);
    }

    function listAsset(uint256 tokenId, uint256 price) public {
        require(assetNFT.ownerOf(tokenId) == msg.sender, "Not asset owner");
        listings[tokenId] = Listing({
            tokenId: tokenId,
            owner: msg.sender,
            price: price,
            listed: true
        });
        emit AssetListed(tokenId, msg.sender, price);
    }

    // [Rest of the contract unchanged]
}
