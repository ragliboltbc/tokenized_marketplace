// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./AssetNFT.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Marketplace is Ownable {
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
        mapping(address => uint256) contributions;
        address[] lenders;
    }

    uint256 public nextListingId;
    uint256 public nextOfferId;
    mapping(uint256 => Listing) public listings; // tokenId => Listing
    mapping(uint256 => Offer) public offers; // offerId => Offer
    mapping(uint256 => uint256[]) public assetOffers; // tokenId => offerIds

    event AssetListed(uint256 indexed tokenId, address indexed owner, uint256 price);
    event AssetUnlisted(uint256 indexed tokenId);
    event OfferCreated(uint256 indexed offerId, uint256 indexed tokenId, address indexed buyer, uint256 price, uint256 interestRate, uint256 duration);
    event OfferFunded(uint256 indexed offerId, address indexed lender, uint256 amount);
    event OfferExecuted(uint256 indexed offerId);
    event OwnershipTransferred(uint256 indexed tokenId, address indexed from, address indexed to);

    constructor(address assetNFT_) {
        assetNFT = AssetNFT(assetNFT_);
    }

    function listAsset(uint256 tokenId, uint256 price) external {
        require(assetNFT.ownerOf(tokenId) == msg.sender, "Not asset owner");
        listings[tokenId] = Listing(tokenId, msg.sender, price, true);
        emit AssetListed(tokenId, msg.sender, price);
    }

    function unlistAsset(uint256 tokenId) external {
        require(listings[tokenId].owner == msg.sender, "Not asset owner");
        listings[tokenId].listed = false;
        emit AssetUnlisted(tokenId);
    }

    function createOffer(uint256 tokenId, uint256 interestRate, uint256 duration) external payable returns (uint256) {
        Listing memory listing = listings[tokenId];
        require(listing.listed, "Asset not listed");
        require(msg.value > 0, "Must send ETH for offer");
        uint256 offerId = nextOfferId++;
        Offer storage offer = offers[offerId];
        offer.offerId = offerId;
        offer.tokenId = tokenId;
        offer.buyer = msg.sender;
        offer.price = listing.price;
        offer.interestRate = interestRate;
        offer.duration = duration;
        offer.status = OfferStatus.Open;
        offer.amountRaised = msg.value;
        offer.lenders.push(msg.sender);
        offer.contributions[msg.sender] = msg.value;
        assetOffers[tokenId].push(offerId);
        emit OfferCreated(offerId, tokenId, msg.sender, listing.price, interestRate, duration);
        emit OfferFunded(offerId, msg.sender, msg.value);
        return offerId;
    }

    function contributeToOffer(uint256 offerId) external payable {
        Offer storage offer = offers[offerId];
        require(offer.status == OfferStatus.Open, "Offer not open");
        require(msg.value > 0, "No ETH sent");
        offer.amountRaised += msg.value;
        if (offer.contributions[msg.sender] == 0) {
            offer.lenders.push(msg.sender);
        }
        offer.contributions[msg.sender] += msg.value;
        emit OfferFunded(offerId, msg.sender, msg.value);
        if (offer.amountRaised >= offer.price) {
            offer.status = OfferStatus.Funded;
            executeOffer(offerId);
        }
    }

    function executeOffer(uint256 offerId) internal {
        Offer storage offer = offers[offerId];
        require(offer.status == OfferStatus.Funded, "Offer not funded");
        Listing memory listing = listings[offer.tokenId];
        require(listing.listed, "Asset not listed");
        // Transfer ETH to seller
        payable(listing.owner).transfer(offer.price);
        // Transfer NFT to buyer
        assetNFT.safeTransferFrom(listing.owner, offer.buyer, offer.tokenId);
        listings[offer.tokenId].listed = false;
        offer.status = OfferStatus.Executed;
        emit OfferExecuted(offerId);
        emit OwnershipTransferred(offer.tokenId, listing.owner, offer.buyer);
    }

    function getOfferLenders(uint256 offerId) external view returns (address[] memory) {
        return offers[offerId].lenders;
    }

    function getContribution(uint256 offerId, address lender) external view returns (uint256) {
        return offers[offerId].contributions[lender];
    }

    function getAssetOffers(uint256 tokenId) external view returns (uint256[] memory) {
        return assetOffers[tokenId];
    }
} 