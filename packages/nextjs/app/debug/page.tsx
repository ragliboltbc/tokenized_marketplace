import { DebugContracts } from "./_components/DebugContracts";
import type { NextPage } from "next";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";
import { ContractUI } from "./_components/contract/ContractUI";

export const metadata = getMetadata({
  title: "Debug Contracts",
  description: "Debug your deployed 🏗 Scaffold-ETH 2 contracts in an easy way",
});

const Debug: NextPage = () => {
  return (
    <div className="space-y-8">
      <ContractUI contractName="AssetNFT" />
      <ContractUI contractName="LendingToken" />
      <ContractUI contractName="AssetLendingLink" />
      <ContractUI contractName="Marketplace" />
      </div>
  );
};

export default Debug;
