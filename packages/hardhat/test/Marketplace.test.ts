import { ethers } from "hardhat";
import { expect } from "chai";

describe("Marketplace", function () {
  let assetNFT: any, marketplace: any, owner: any, seller: any, buyer: any, lender: any;
  beforeEach(async function () {
    [owner, seller, buyer, lender] = await ethers.getSigners();
    const AssetNFT = await ethers.getContractFactory("AssetNFT");
    assetNFT = await AssetNFT.deploy();
    await assetNFT.deployed();
    const Marketplace = await ethers.getContractFactory("Marketplace");
    marketplace = await Marketplace.deploy(assetNFT.address);
    await marketplace.deployed();
    await assetNFT.transferOwnership(owner.address);
    await assetNFT.connect(owner).mint(seller.address, "Car", "Cars", "A car", "Sedan", "VIN123", "BrandX", 100);
  });
  it("should allow asset listing and offer creation", async function () {
    await assetNFT.connect(seller).approve(marketplace.address, 0);
    await marketplace.connect(seller).listAsset(0, 100);
    await expect(marketplace.connect(buyer).createOffer(0, 10, 3600, { value: 50 }))
      .to.emit(marketplace, "OfferCreated");
    await marketplace.connect(lender).contributeToOffer(0, { value: 50 });
    // After full funding, asset should be transferred to buyer
    expect(await assetNFT.ownerOf(0)).to.equal(buyer.address);
  });
}); 