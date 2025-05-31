// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AssetNFT is ERC721, Ownable {
    struct AssetMetadata {
        string name;
        string assetType;
        string legalId;
        string brand;
        uint256 estimatedValue;
    }

    uint256 public nextTokenId;
    mapping(uint256 => AssetMetadata) public assetMetadata;

    event AssetMinted(uint256 indexed tokenId, address indexed owner, AssetMetadata metadata);

    constructor() ERC721("AssetNFT", "ANFT") Ownable(msg.sender) {
        
    }

    function mint(
        address to,
        string memory name_,
        string memory assetType_,
        string memory legalId_,
        string memory brand_,
        uint256 estimatedValue_
    ) external onlyOwner returns (uint256) {
        uint256 tokenId = nextTokenId++;
        _safeMint(to, tokenId);
        assetMetadata[tokenId] = AssetMetadata(name_, assetType_, legalId_, brand_, estimatedValue_);
        emit AssetMinted(tokenId, to, assetMetadata[tokenId]);
        return tokenId;
    }

    function getAssetMetadata(uint256 tokenId) external view returns (AssetMetadata memory) {
        return assetMetadata[tokenId];
    }
} 