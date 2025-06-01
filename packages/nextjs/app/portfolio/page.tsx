"use client";

import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { CONTRACTS } from "../../constants";
import { usePublicClient } from "wagmi";

const fromTinybars = (tinybars: number) => Number(tinybars) / 100_000_000;

const GENERIC_IMAGES = {
  "Real Estate": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  "Luxury Items": "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=400&q=80",
  "default": "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80"
};

interface Asset {
  tokenId: string;
  name: string;
  owner: string;
  category: string;
  description?: string;
  estimatedValue?: number;
  imageUrl?: string;
  financed?: boolean;
  debt?: number;
}

export default function PortfolioPage() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSell, setShowSell] = useState<string | null>(null);
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
                      { internalType: "uint256", name: "estimatedValue", type: "uint256" }
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

        const all = (await Promise.all(metaPromises)).filter(Boolean) as Asset[];
        // Fallback: If no real assets, show demo assets
        if (all.length === 0) {
          setAssets([
            // Your owned assets
            { 
              tokenId: "1", 
              name: "Mountain Villa", 
              owner: address || "0x123", 
              category: "Real Estate", 
              description: "Luxury mountain villa with panoramic views, 5 bedrooms, 4 bathrooms",
              estimatedValue: 350000,
              imageUrl: undefined,
              financed: false
            },
            { 
              tokenId: "2", 
              name: "Classic Ferrari Collection", 
              owner: address || "0x123", 
              category: "Luxury Items", 
              description: "Collection of three vintage Ferrari sports cars from the 1960s",
              estimatedValue: 280000,
              imageUrl: undefined,
              financed: false
            },
            { 
              tokenId: "3", 
              name: "Rolex Daytona", 
              owner: address || "0x123", 
              category: "Luxury Items", 
              description: "Limited edition Rolex Daytona, platinum case with meteorite dial",
              estimatedValue: 85000,
              imageUrl: undefined,
              financed: false
            },
            { 
              tokenId: "4", 
              name: "Modern Art Portfolio", 
              owner: address || "0x123", 
              category: "Art", 
              description: "Collection of contemporary artworks from renowned artists",
              estimatedValue: 150000,
              imageUrl: undefined,
              financed: false
            },
            { 
              tokenId: "5", 
              name: "Commercial Property", 
              owner: address || "0x123", 
              category: "Real Estate", 
              description: "Prime location retail space, fully leased with stable income",
              estimatedValue: 450000,
              imageUrl: undefined,
              financed: false
            },
            // Assets you're financing
            { 
              tokenId: "6", 
              name: "Beach House Miami", 
              owner: "0xA1B2...C3", 
              category: "Real Estate", 
              description: "Oceanfront property in Miami Beach with private pool",
              estimatedValue: 650000,
              imageUrl: undefined,
              financed: true,
              debt: 250000
            },
            { 
              tokenId: "7", 
              name: "Fine Wine Collection", 
              owner: "0xD4E5...F6", 
              category: "Luxury Items", 
              description: "Premium wine collection including rare vintages",
              estimatedValue: 180000,
              imageUrl: undefined,
              financed: true,
              debt: 75000
            },
            { 
              tokenId: "8", 
              name: "Banksy Original", 
              owner: "0xF7G8...H9", 
              category: "Art", 
              description: "Original Banksy artwork with authenticated provenance",
              estimatedValue: 320000,
              imageUrl: undefined,
              financed: true,
              debt: 120000
            },
            {
              tokenId: "9",
              name: "Yacht Share", 
              owner: "0xI9J0...K1", 
              category: "Luxury Items", 
              description: "25% ownership of a 100ft luxury yacht",
              estimatedValue: 750000,
              imageUrl: undefined,
              financed: true,
              debt: 280000
            },
            {
              tokenId: "10",
              name: "Downtown Office Building",
              owner: "0xL2M3...N4",
              category: "Real Estate",
              description: "Class A office building in prime downtown location",
              estimatedValue: 1200000,
              imageUrl: undefined,
              financed: true,
              debt: 450000
            }
          ]);
        } else {
          setAssets(all);
        }
      } catch {
        setAssets([]); // If error occurs, show empty state
      }
      setLoading(false);
    };

    fetchAssets();
    const interval = setInterval(fetchAssets, 5000);
    return () => clearInterval(interval);
  }, [address, publicClient]);

  // Group assets by ownership and financing
  const ownedAssets = assets.filter(asset => asset.owner === address && !asset.financed);
  const financedAssets = assets.filter(asset => asset.financed);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Portfolio</h1>
      <div className="mb-4 text-gray-400">
        View all assets you own or have funded. You can see your NFTs, their estimated value, and details.
      </div>

      <div className="space-y-4">
        {loading && <div>Loading assets...</div>}
        {assets.length > 0 && assets.map(asset => {
          const img = asset.imageUrl || GENERIC_IMAGES[asset.category as keyof typeof GENERIC_IMAGES] || GENERIC_IMAGES["default"];

          return (
            <div key={asset.tokenId} className="card bg-base-100 shadow p-4 flex flex-col md:flex-row gap-4 items-center">
              <img src={img} alt={asset.name} className="w-32 h-32 object-cover rounded-xl border" />
              <div className="flex-grow">
                <h2 className="font-bold text-lg">{asset.name}</h2>
                <div>Token ID: {asset.tokenId}</div>
                <div>Category: {asset.category}</div>
                <div className="text-gray-400">Description: {asset.description}</div>
                <div>Owner: {asset.owner}</div>
                <div>Estimated Value: {fromTinybars(asset.estimatedValue ?? 0)} HBAR</div>

                {asset.financed ? (
                  <div className="mt-2">
                    <div className="text-sm text-yellow-700">Outstanding Debt: {fromTinybars(asset.debt ?? 0)} HBAR</div>
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