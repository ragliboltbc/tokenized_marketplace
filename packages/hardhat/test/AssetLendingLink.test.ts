import { ethers } from "hardhat";
import { expect } from "chai";

describe("AssetLendingLink", function () {
  let assetNFT: any, lendingToken: any, link: any, owner: any, lender: any;
  beforeEach(async function () {
    [owner, lender] = await ethers.getSigners();
    const AssetNFT = await ethers.getContractFactory("AssetNFT");
    assetNFT = await AssetNFT.deploy();
    await assetNFT.deployed();
    const LendingToken = await ethers.getContractFactory("LendingToken");
    lendingToken = await LendingToken.deploy("LendToken", "LTK");
    await lendingToken.deployed();
    const AssetLendingLink = await ethers.getContractFactory("AssetLendingLink");
    link = await AssetLendingLink.deploy(assetNFT.address, lendingToken.address);
    await link.deployed();
    await lendingToken.setMinter(link.address);
    await assetNFT.transferOwnership(owner.address);
    await link.transferOwnership(owner.address);
    await lendingToken.transferOwnership(owner.address);
    await assetNFT.mint(owner.address, "Car", "Car", "VIN123", "Tesla", 100);
  });
  it("should allow lending and mint LendingTokens", async function () {
    await link.connect(lender).lend(0, { value: 50 });
    expect(await lendingToken.balanceOf(lender.address)).to.equal(50);
  });
  it("should allow owner to repay and lenders to withdraw", async function () {
    await link.connect(lender).lend(0, { value: 50 });
    await link.connect(owner).repay(0, { value: 100 });
    await link.connect(lender).withdraw(0);
    expect(await lendingToken.balanceOf(lender.address)).to.equal(0);
  });
  it("should lock and unlock asset", async function () {
    await link.lock(0);
    await expect(link.connect(lender).lend(0, { value: 10 })).to.be.revertedWith("Asset is locked");
    await link.unlock(0);
    await link.connect(lender).lend(0, { value: 10 });
    expect(await lendingToken.balanceOf(lender.address)).to.equal(10);
  });
}); 