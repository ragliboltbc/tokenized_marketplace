// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LendingToken is ERC20, Ownable {
    address public minter;

    constructor(address initialOwner) ERC20("LendingToken", "LEND") {
        _transferOwnership(initialOwner);
    }

    modifier onlyMinter() {
        require(msg.sender == minter, "Not authorized");
        _;
    }

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
