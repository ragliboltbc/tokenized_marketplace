"use client";

import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { CONTRACTS } from "../../constants";
import { usePublicClient } from "wagmi";

const fromTinybars = (tinybars) => Number(tinybars) / 100_000_000;

const GENERIC_IMAGES = {
  "Real Estate": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  "Luxury Items": "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=400&q=80",
  "default": "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80"
};

export default function PortfolioPage() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSell, setShowSell] = useState(null);
  const [sellPrice, setSellPrice] = useState("");

  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true);
      if (!address || !publicClient) {
        setAssets([]);
        setLoading(false);
        return;
      }

      try {
        const totalMinted = await publicClient.readContract({
          address: CONTRACTS.assetNFT,
          abi: [{
            inputs: [],
            name: "totalMinted",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            stateMutability: "view",
            type: "function"
          }],
          functionName: "totalMinted",
        });

        const metaPromises = [];
        for (let i = 0n; i < totalMinted; i++) {
          metaPromises.push(
            (async () => {
              try {
                const owner = await publicClient.readContract({
                  address: CONTRACTS.assetNFT,
                  abi: [{
                    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
                    name: "ownerOf",
                    outputs: [{ internalType: "address", name: "", type: "address" }],
                    stateMutability: "view",
                    type: "function"
                  }],
                  functionName: "ownerOf",
                  args: [i],
                });

                if (owner.toLowerCase() !== address.toLowerCase()) return null;

                const meta = await publicClient.readContract({
                  address: CONTRACTS.assetNFT,
                  abi: [{
                    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
                    name: "getAssetMetadata",
                    outputs: [
                      { internalType: "string", name: "name", type: "string" },
                      { internalType: "string", name: "category", type: "string" },
                      { internalType: "string", name: "description", type: "string" },
                      { internalType: "string", name: "assetType", type: "string" },
                      { internalType: "string", name: "legalId", type: "string" },
                      { internalType: "string", name: "brand", type: "string" },
                      { internalType: "uint256", name: "estimatedValue", type: "uint256" },
                      { internalType: "string", name: "imageUrl", type: "string" }
                    ],
                    stateMutability: "view",
                    type: "function"
                  }],
                  functionName: "getAssetMetadata",
                  args: [i],
                });

                return { ...meta, tokenId: i.toString(), owner };
              } catch {
                return null;
              }
            })()
          );
        }

        const allAssets = (await Promise.all(metaPromises)).filter(Boolean);
        setAssets(allAssets);
      } catch {
        setAssets([]);
      }
      setLoading(false);
    };

    fetchAssets();
    const interval = setInterval(fetchAssets, 5000);
    return () => clearInterval(interval);
  }, [address, publicClient]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Portfolio</h1>
      <div className="mb-4 text-gray-400">
        View all assets you own or have funded. You can see your NFTs, their estimated value, and details.
      </div>

      <div className="space-y-4">
        {loading && <div>Loading assets...</div>}
        {assets.length > 0 && assets.map(asset => {
          const img = asset.imageUrl || GENERIC_IMAGES[asset.category] || GENERIC_IMAGES["default"];

          return (
            <div key={asset.tokenId} className="card bg-base-100 shadow p-4 flex flex-col md:flex-row gap-4 items-center">
              <img src={img} alt={asset.name} className="w-32 h-32 object-cover rounded-xl border" />
              <div>
                <h2 className="font-bold text-lg">{asset.name}</h2>
                <div>Token ID: {asset.tokenId}</div>
                <div>Category: {asset.category}</div>
                <div className="text-gray-400">Description: {asset.description}</div>
                <div>Owner: {asset.owner}</div>
                <div>Estimated Value: {fromTinybars(asset.estimatedValue)} HBAR</div>

                {asset.financed ? (
                  <div className="mt-2">
                    <div className="text-sm text-yellow-700">Outstanding Debt: {fromTinybars(asset.debt)} HBAR</div>
                    <button className="btn btn-primary mt-1">Repay Loan</button>
                  </div>
                ) : (
                  <button className="btn btn-secondary mt-2" onClick={() => setShowSell(asset.tokenId)}>
                    Sell on Marketplace
                  </button>
                )}

                {showSell === asset.tokenId && !asset.financed && (
                  <form
                    className="mt-2 flex flex-col gap-2"
                    onSubmit={e => {
                      e.preventDefault();
                      // Call listAsset function here with tokenId and sellPrice
                      setShowSell(null);
                      setSellPrice("");
                    }}
                  >
                    <input
                      type="number"
                      className="input input-bordered"
                      placeholder="Listing Price (HBAR)"
                      value={sellPrice}
                      onChange={e => setSellPrice(e.target.value)}
                      required
                    />
                    <div className="text-xs text-gray-400">Set the price in HBAR for your asset listing.</div>
                    <button className="btn btn-primary" type="submit">Confirm Listing</button>
                  </form>
                )}
              </div>
            </div>
          );
        })}
        {!loading && assets.length === 0 && <div>No assets found.</div>}
      </div>
    </div>
  );
}