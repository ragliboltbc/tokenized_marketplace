// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./AssetNFT.sol";
import "./LendingToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AssetLendingLink is Ownable {
    AssetNFT public assetNFT;
    LendingToken public lendingToken;

    struct LendingInfo {
        uint256 totalLent;
        uint256 totalRepaid;
        mapping(address => uint256) lenderBalances;
        bool locked;
    }

    mapping(uint256 => LendingInfo) public lendingInfos;

    event Lent(address indexed lender, uint256 indexed tokenId, uint256 amount);
    event Repaid(address indexed borrower, uint256 indexed tokenId, uint256 amount);
    event Withdrawn(address indexed lender, uint256 indexed tokenId, uint256 amount);
    event Locked(uint256 indexed tokenId);
    event Unlocked(uint256 indexed tokenId);

    constructor(address initialOwner, address assetNFT_, address lendingToken_) {
        _transferOwnership(initialOwner);
        assetNFT = AssetNFT(assetNFT_);
        lendingToken = LendingToken(lendingToken_);
    }

    function lend(uint256 tokenId) external payable {
        require(!lendingInfos[tokenId].locked, "Asset is locked");
        require(msg.value > 0, "No ETH sent");
        lendingInfos[tokenId].totalLent += msg.value;
        lendingInfos[tokenId].lenderBalances[msg.sender] += msg.value;
        lendingToken.mint(msg.sender, msg.value);
        emit Lent(msg.sender, tokenId, msg.value);
    }

    function repay(uint256 tokenId) external payable onlyOwner {
        require(msg.value > 0, "No ETH sent");
        lendingInfos[tokenId].totalRepaid += msg.value;
        emit Repaid(msg.sender, tokenId, msg.value);
    }

    function withdraw(uint256 tokenId) external {
        uint256 share = getWithdrawableAmount(tokenId, msg.sender);
        require(share > 0, "Nothing to withdraw");
        lendingInfos[tokenId].lenderBalances[msg.sender] = 0;
        payable(msg.sender).transfer(share);
        lendingToken.burn(msg.sender, share);
        emit Withdrawn(msg.sender, tokenId, share);
    }

    function getWithdrawableAmount(uint256 tokenId, address lender) public view returns (uint256) {
        uint256 lent = lendingInfos[tokenId].lenderBalances[lender];
        uint256 totalLent = lendingInfos[tokenId].totalLent;
        uint256 totalRepaid = lendingInfos[tokenId].totalRepaid;
        if (totalLent == 0) return 0;
        return (totalRepaid * lent) / totalLent;
    }

    function lock(uint256 tokenId) external onlyOwner {
        lendingInfos[tokenId].locked = true;
        emit Locked(tokenId);
    }

    function unlock(uint256 tokenId) external onlyOwner {
        lendingInfos[tokenId].locked = false;
        emit Unlocked(tokenId);
    }
}
