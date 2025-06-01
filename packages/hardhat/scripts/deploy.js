const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with account:", deployer.address);

  // Deploy AssetNFT first
  const AssetNFT = await hre.ethers.getContractFactory("AssetNFT");
  const assetNFT = await AssetNFT.deploy(deployer.address); // <- single arg constructor
  await assetNFT.deployed();
  console.log("AssetNFT deployed at:", assetNFT.address);

  // Deploy Marketplace with AssetNFT address
  const Marketplace = await hre.ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(assetNFT.address, deployer.address);
  await marketplace.deployed();
  console.log("Marketplace deployed at:", marketplace.address);

  // Optionally deploy LendingToken and AssetLendingLink if needed
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
