const { ethers } = require("hardhat");
const { getAddress, parseUnits } = require("ethers");

// The deployer account is set via hardhat.config.ts and uses the provided private key.

async function main() {
  const [deployer] = await ethers.getSigners();
  const deployerAddress = getAddress(deployer.address);
  console.log("Deploying contracts with:", deployerAddress);

  // AssetNFT
  const AssetNFT = await ethers.getContractFactory("AssetNFT");
  const assetNFT = await AssetNFT.deploy(deployerAddress);
  await assetNFT.waitForDeployment();
  console.log("AssetNFT deployed to:", await assetNFT.getAddress());

  // LendingToken
  const LendingToken = await ethers.getContractFactory("LendingToken");
  const lendingToken = await LendingToken.deploy(deployerAddress);
  await lendingToken.waitForDeployment();
  console.log("LendingToken deployed to:", await lendingToken.getAddress());

  // AssetLendingLink
  const AssetLendingLink = await ethers.getContractFactory("AssetLendingLink");
  const assetLendingLink = await AssetLendingLink.deploy(deployerAddress, await assetNFT.getAddress(), await lendingToken.getAddress());
  await assetLendingLink.waitForDeployment();
  console.log("AssetLendingLink deployed to:", await assetLendingLink.getAddress());

  // Set AssetLendingLink as minter for LendingToken
  await lendingToken.setMinter(await assetLendingLink.getAddress());

  // Marketplace
  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(
    getAddress(await assetNFT.getAddress()),
    deployerAddress
  );
  await marketplace.waitForDeployment();
  console.log("Marketplace deployed to:", await marketplace.getAddress());

  // Demo addresses (replace with real testnet addresses for best UX)
  const demoUsers = [
    deployerAddress,
    "0x1111111111111111111111111111111111111111",
    "0x2222222222222222222222222222222222222222",
    "0x3333333333333333333333333333333333333333",
    "0x4444444444444444444444444444444444444444",
  ];

  // Mint demo assets to different users
  const mintTx1 = await assetNFT.mint(demoUsers[0], "BMW 530d", "Cars", "Diesel, 2020, 80k km", "Car", "VXKUPHNSSM4206445", "BMW", parseUnits("20000", 8), "https://images.unsplash.com/photo-1511918984145-48de785d4c4e?auto=format&fit=crop&w=400&q=80");
  await mintTx1.wait();
  const mintTx2 = await assetNFT.mint(demoUsers[1], "Rolex Submariner", "Watches", "Black dial, 2022", "Watch", "RLX2022SUB", "Rolex", parseUnits("12000", 8), "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80");
  await mintTx2.wait();
  const mintTx3 = await assetNFT.mint(demoUsers[2], "Apartment Berlin", "Real Estate", "2 rooms, Prenzlauer Berg", "Apartment", "BERL2023APT", "", parseUnits("350000", 8), "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80");
  await mintTx3.wait();
  const mintTx4 = await assetNFT.mint(demoUsers[3], "Tesla Model 3", "Cars", "Electric, 2021, 15k km", "Car", "TESLA2021VIN", "Tesla", parseUnits("45000", 8), "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80");
  await mintTx4.wait();
  const mintTx5 = await assetNFT.mint(demoUsers[4], "Hermès Birkin", "Luxury Items", "Birkin 30, Togo leather, gold hardware", "Bag", "HERMESBIRKIN30", "Hermès", parseUnits("18000", 8), "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80");
  await mintTx5.wait();

  // List all demo assets in marketplace
  for (let i = 0; i < 5; i++) {
    await marketplace.listAsset(i, parseUnits((20000 + i * 10000).toString(), 8));
  }

  // Demo lending: Lend to asset 0 from user 2
  await assetLendingLink.lend(0, { value: parseUnits("1000", 8) });
  // Demo lending: Lend to asset 1 from user 3
  await assetLendingLink.lend(1, { value: parseUnits("2000", 8) });
  // Demo lending: Lend to asset 2 from user 4
  await assetLendingLink.lend(2, { value: parseUnits("3000", 8) });
  // Demo lending: Lend to asset 3 from user 1
  await assetLendingLink.lend(3, { value: parseUnits("4000", 8) });
  // Demo lending: Lend to asset 4 from user 0
  await assetLendingLink.lend(4, { value: parseUnits("5000", 8) });

  console.log("Demo assets, listings, and lending set up.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
