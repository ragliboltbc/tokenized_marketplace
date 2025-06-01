// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title LendingToken
 * @dev ERC20 token used for lending in the marketplace
 * @notice This contract manages the lending token which represents lending positions
 * @dev Inherits from ERC20 and Ownable contracts
 */
contract LendingToken is ERC20, Ownable {
    // Address allowed to mint and burn tokens
    address public minter;

    /**
     * @dev Constructor sets up token name, symbol and transfers ownership
     * @param initialOwner Address that will own the contract
     */
    constructor(address initialOwner) ERC20("LendingToken", "LEND") {
        _transferOwnership(initialOwner);
    }

    /**
     * @dev Modifier to restrict function access to minter only
     */
    modifier onlyMinter() {
        require(msg.sender == minter, "Not authorized");
        _;
    }

    /**
     * @dev Sets the minter address
     * @param minter_ Address to be set as minter
     */
    function setMinter(address minter_) external onlyOwner {
        minter = minter_;
    }

    /**
     * @dev Mints new tokens
     * @param to Address to receive the minted tokens
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) external onlyMinter {
        _mint(to, amount);
    }

    /**
     * @dev Burns tokens from an address
     * @param from Address to burn tokens from
     * @param amount Amount of tokens to burn
     */
    function burn(address from, uint256 amount) external onlyMinter {
        _burn(from, amount);
    }
}
