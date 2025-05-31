"use client";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { useEffect, useState } from "react";

export default function PortfolioPage() {
  const { address } = useAccount();
  const { data: balance } = useScaffoldReadContract({
    contractName: "AssetNFT",
    functionName: "balanceOf",
    args: [address],
  });

  const [assets, setAssets] = useState<any[]>([]);

  useEffect(() => {
    const fetchAssets = async () => {
      if (!address || !balance) return;
      const assetPromises = [];
      for (let i = 0; i < Number(balance); i++) {
        assetPromises.push(
          window.scaffoldEth?.readContract({
            contractName: "AssetNFT",
            functionName: "tokenOfOwnerByIndex",
            args: [address, i],
          })
        );
      }
      const tokenIds = await Promise.all(assetPromises);
      const metaPromises = tokenIds.map((tokenId: any) =>
        window.scaffoldEth?.readContract({
          contractName: "AssetNFT",
          functionName: "getAssetMetadata",
          args: [tokenId],
        }).then((meta: any) => ({ ...meta, tokenId }))
      );
      const metas = await Promise.all(metaPromises);
      setAssets(metas);
    };
    fetchAssets();
  }, [address, balance]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Portfolio</h1>
      <div className="space-y-4">
        {assets.length === 0 && <div>No assets found.</div>}
        {assets.map(asset => (
          <div key={asset.tokenId} className="card bg-base-100 shadow p-4">
            <h2 className="font-bold text-lg">{asset.name}</h2>
            <div>Token ID: {asset.tokenId}</div>
            <div>Category: {asset.category}</div>
            <div>Description: {asset.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
} 