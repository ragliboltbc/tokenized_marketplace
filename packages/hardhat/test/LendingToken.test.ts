import { ethers } from "hardhat";
import { expect } from "chai";

describe("LendingToken", function () {
  it("should set minter, mint, and burn", async function () {
    const [_developer, minter, user] = await ethers.getSigners();
    const LendingToken = await ethers.getContractFactory("LendingToken");
    const token = await LendingToken.deploy("LendToken", "LTK");
    await token.deployed();
    await token.setMinter(minter.address);
    expect(await token.minter()).to.equal(minter.address);
    await token.connect(minter).mint(user.address, 1000);
    expect(await token.balanceOf(user.address)).to.equal(1000);
    await token.connect(minter).burn(user.address, 500);
    expect(await token.balanceOf(user.address)).to.equal(500);
  });
  it("should not allow non-minter to mint or burn", async function () {
    const [_developer, minter, user, attacker] = await ethers.getSigners();
    const LendingToken = await ethers.getContractFactory("LendingToken");
    const token = await LendingToken.deploy("LendToken", "LTK");
    await token.deployed();
    await token.setMinter(minter.address);
    await expect(token.connect(attacker).mint(user.address, 1000)).to.be.revertedWith("Not authorized");
    await expect(token.connect(attacker).burn(user.address, 1000)).to.be.revertedWith("Not authorized");
  });
}); 