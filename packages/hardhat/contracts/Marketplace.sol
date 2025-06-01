// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./AssetNFT.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title Marketplace
 * @dev A marketplace contract for listing and trading NFT assets with lending functionality
 * @notice This contract manages listings, offers and lending for NFT assets
 * @dev Inherits from Ownable and ReentrancyGuard for access control and security
 */
contract Marketplace is Ownable, ReentrancyGuard {
    // Reference to the NFT contract
    AssetNFT public assetNFT;

    // Status enum for tracking offer states
    enum OfferStatus { Open, Funded, Cancelled, Executed }

    /**
     * @dev Struct representing an asset listing
     * @param tokenId ID of the NFT being listed
     * @param owner Address of the NFT owner
     * @param price Listing price in ETH
     * @param listed Boolean indicating if asset is currently listed
     */
    struct Listing {
        uint256 tokenId;
        address owner;
        uint256 price;
        bool listed;
    }

    /**
     * @dev Struct representing a purchase offer with lending terms
     * @param offerId Unique identifier for the offer
     * @param tokenId ID of the NFT being offered on
     * @param buyer Address making the offer
     * @param price Offer price in ETH
     * @param interestRate Annual interest rate in percentage
     * @param duration Loan duration in seconds
     * @param amountRaised Total ETH raised from lenders
     * @param status Current status of the offer
     * @param lenders Array of addresses that contributed to funding
     */
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

    // Counter for generating unique offer IDs
    uint256 public nextOfferId;

    // Mappings for storing listings, offers and related data
    mapping(uint256 => Listing) public listings;
    mapping(uint256 => Offer) public offers;
    mapping(uint256 => uint256[]) public assetOffers;
    mapping(uint256 => mapping(address => uint256)) public contributions;

    // Events emitted by the contract
    event AssetListed(uint256 indexed tokenId, address indexed owner, uint256 price);
    event AssetUnlisted(uint256 indexed tokenId);
    event OfferCreated(uint256 indexed offerId, uint256 indexed tokenId, address indexed buyer, uint256 price, uint256 interestRate, uint256 duration);
    event OfferFunded(uint256 indexed offerId, address indexed lender, uint256 amount);
    event OfferExecuted(uint256 indexed offerId);
    event OwnershipTransferred(uint256 indexed tokenId, address indexed from, address indexed to);

    /**
     * @dev Constructor initializes the marketplace with NFT contract and owner
     * @param assetNFT_ Address of the NFT contract
     * @param initialOwner Address that will own the marketplace contract
     */
    constructor(address assetNFT_, address initialOwner) {
        assetNFT = AssetNFT(assetNFT_);
        _transferOwnership(initialOwner);
    }

    // [Rest of the contract unchanged]
}
