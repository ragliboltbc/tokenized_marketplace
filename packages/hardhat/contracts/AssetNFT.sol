// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AssetNFT is ERC721Enumerable, Ownable {
    struct AssetMetadata {
        string name;
        string category;
        string description;
        string assetType;
        string legalId;
        string brand;
        uint256 estimatedValue;
    }

    uint256 public nextTokenId;
    mapping(uint256 => AssetMetadata) public assetMetadata;

    event AssetMinted(uint256 indexed tokenId, address indexed owner, AssetMetadata metadata);

    constructor(address initialOwner) ERC721("AssetNFT", "ANFT") {
        _transferOwnership(initialOwner);
    }

    function mint(
        address to,
        string memory name_,
        string memory category_,
        string memory description_,
        string memory assetType_,
        string memory legalId_,
        string memory brand_,
        uint256 estimatedValue_
    ) external onlyOwner returns (uint256) {
        uint256 tokenId = nextTokenId++;
        _safeMint(to, tokenId);
        assetMetadata[tokenId] = AssetMetadata(name_, category_, description_, assetType_, legalId_, brand_, estimatedValue_);
        emit AssetMinted(tokenId, to, assetMetadata[tokenId]);
        return tokenId;
    }

    function getAssetMetadata(uint256 tokenId) external view returns (AssetMetadata memory) {
        return assetMetadata[tokenId];
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
}
