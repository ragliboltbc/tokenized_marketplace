// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LendingToken is ERC20, Ownable(msg.sender) {
    address public minter;

    modifier onlyMinter() {
        require(msg.sender == minter, "Not authorized");
        _;
    }

    constructor(string memory name_, string memory symbol_) ERC20(name_, symbol_) {}

    function setMinter(address minter_) external onlyOwner {
        minter = minter_;
    }

    function mint(address to, uint256 amount) external onlyMinter {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyMinter {
        _burn(from, amount);
    }
} 