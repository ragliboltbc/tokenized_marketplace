import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const assetNFT = await deploy("AssetNFT", {
    from: deployer,
    args: [deployer],
    log: true,
  });

  const lendingToken = await deploy("LendingToken", {
    from: deployer,
    args: [deployer],
    log: true,
  });

  const marketplace = await deploy("Marketplace", {
    from: deployer,
    args: [assetNFT.address, deployer], // ✅ exactly 2 args
    log: true,
  });
};

export default deployContracts;
deployContracts.tags = ["core"];
