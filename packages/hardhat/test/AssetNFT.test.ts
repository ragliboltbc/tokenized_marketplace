import { ethers } from "hardhat";
import { expect } from "chai";

describe("AssetNFT", function () {
  it("should mint and store metadata", async function () {
    const [_developer, user] = await ethers.getSigners();
    const AssetNFT = await ethers.getContractFactory("AssetNFT");
    const assetNFT = await AssetNFT.deploy();
    await assetNFT.deployed();

    const tx = await assetNFT.mint(user.address, "Car", "Car", "VIN123", "Tesla", 100);
    await tx.wait();
    const meta = await assetNFT.assetMetadata(0);
    expect(meta.name).to.equal("Car");
    expect(meta.assetType).to.equal("Car");
    expect(meta.legalId).to.equal("VIN123");
    expect(meta.brand).to.equal("Tesla");
    expect(meta.estimatedValue).to.equal(100);
  });
}); 