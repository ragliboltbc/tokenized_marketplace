"use client";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { CONTRACTS } from "../../constants";
import { usePublicClient } from "wagmi";

const DEMO_DEPLOYER = "0x766bcFcc54972643263A24B13a0219bfA88A2513".toLowerCase();

const fromTinybars = (tinybars: string | number | bigint) => Number(tinybars) / 100_000_000;

export default function PortfolioPage() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const fetchAssets = async () => {
      setLoading(true);
      if (!address || !publicClient) {
        setAssets([]);
        setLoading(false);
        return;
      }
      try {
        // 1. Get total minted tokens
        const totalMinted: bigint = await publicClient.readContract({
          address: CONTRACTS.assetNFT as `0x${string}`,
          abi: [
            {
              "inputs": [],
              "name": "totalMinted",
              "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
              "stateMutability": "view",
              "type": "function"
            }
          ],
          functionName: "totalMinted",
        });
        // 2. For each tokenId, check owner
        const metaPromises = [];
        for (let i = 0n; i < totalMinted; i++) {
          metaPromises.push(
            (async () => {
              const owner: string = await publicClient.readContract({
                address: CONTRACTS.assetNFT as `0x${string}`,
                abi: [
                  {
                    "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
                    "name": "ownerOf",
                    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
                    "stateMutability": "view",
                    "type": "function"
                  }
                ],
                functionName: "ownerOf",
                args: [i],
              });
              if (owner.toLowerCase() !== address.toLowerCase()) return null;
              const meta = await publicClient.readContract({
                address: CONTRACTS.assetNFT as `0x${string}`,
                abi: [
                  {
                    "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
                    "name": "getAssetMetadata",
                    "outputs": [
                      { "internalType": "string", "name": "name", "type": "string" },
                      { "internalType": "string", "name": "category", "type": "string" },
                      { "internalType": "string", "name": "description", "type": "string" },
                      { "internalType": "string", "name": "assetType", "type": "string" },
                      { "internalType": "string", "name": "legalId", "type": "string" },
                      { "internalType": "string", "name": "brand", "type": "string" },
                      { "internalType": "uint256", "name": "estimatedValue", "type": "uint256" },
                      { "internalType": "string", "name": "imageUrl", "type": "string" }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                  }
                ],
                functionName: "getAssetMetadata",
                args: [i],
              });
              return { ...meta, tokenId: i.toString(), owner };
            })()
          );
        }
        const allAssets = (await Promise.all(metaPromises)).filter(Boolean);
        setAssets(allAssets);
      } catch (e) {
        setAssets([]);
      }
      setLoading(false);
    };
    fetchAssets();
    interval = setInterval(fetchAssets, 5000);
    return () => clearInterval(interval);
  }, [address, publicClient]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Portfolio</h1>
      <div className="space-y-4">
        {loading && <div>Loading assets...</div>}
        {!loading && assets.length === 0 && <div>No assets found.</div>}
        {assets.map(asset => (
          <div key={asset.tokenId} className="card bg-base-100 shadow p-4 flex flex-col md:flex-row gap-4 items-center">
            {asset.imageUrl && (
              <img src={asset.imageUrl} alt={asset.name} className="w-32 h-32 object-cover rounded-xl border" />
            )}
            <div>
              <h2 className="font-bold text-lg">{asset.name}</h2>
              <div>Token ID: {asset.tokenId}</div>
              <div>Category: {asset.category}</div>
              <div>Description: {asset.description}</div>
              <div>Owner: {asset.owner}</div>
              <div>Estimated Value: {fromTinybars(asset.estimatedValue)} HBAR</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 