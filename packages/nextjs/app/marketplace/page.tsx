// Cleaned-up and improved MarketplacePage component
"use client";
import { useEffect, useState } from "react";
import { useUser } from "../../components/UserContext";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { CONTRACTS } from "../../constants";
import { usePublicClient } from "wagmi";

const toTinybars = (hbar: number) => BigInt(Math.floor(Number(hbar) * 100_000_000));
const fromTinybars = (tinybars: number) => Number(tinybars) / 100_000_000;

const GENERIC_IMAGES = {
  "Real Estate": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  "Luxury Items": "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=400&q=80",
  "default": "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80"
};

interface Asset {
  tokenId: number;
  name: string;
  owner: string;
  price: string;
  category: string;
  description?: string;
  estimatedValue?: number;
  imageUrl?: string;
  listing?: { listed: boolean; price: number };
}

export default function MarketplacePage() {
  const { currentUser } = useUser();
  const { writeContractAsync: listAsset } = useScaffoldWriteContract({ contractName: "Marketplace" });
  const { writeContractAsync: createOffer } = useScaffoldWriteContract({ contractName: "Marketplace" });
  const publicClient = usePublicClient();
  const [tokens, setTokens] = useState<Asset[]>([]);
  const [listingPrice, setListingPrice] = useState("");
  const [showBuy, setShowBuy] = useState<string | null>(null);
  const [interestRate, setInterestRate] = useState("");
  const [offerMsg, setOfferMsg] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const fetchTokens = async () => {
      if (!publicClient) return;
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
                const [meta, owner, listing] = await Promise.all([
                  publicClient.readContract({
                    address: CONTRACTS.assetNFT,
                    abi: [
                      {
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
                      }
                    ],
                    functionName: "getAssetMetadata",
                    args: [i],
                  }),
                  publicClient.readContract({
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
                  }),
                  publicClient.readContract({
                    address: CONTRACTS.marketplace,
                    abi: [{
                      inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
                      name: "listings",
                      outputs: [
                        { internalType: "uint256", name: "tokenId", type: "uint256" },
                        { internalType: "address", name: "owner", type: "address" },
                        { internalType: "uint256", name: "price", type: "uint256" },
                        { internalType: "bool", name: "listed", type: "bool" }
                      ],
                      stateMutability: "view",
                      type: "function"
                    }],
                    functionName: "listings",
                    args: [i],
                  })
                ]);
                // Mapping zu Asset-Objekt
                return {
                  tokenId: Number(i),
                  name: meta[0],
                  category: meta[1],
                  description: meta[2],
                  owner: owner,
                  estimatedValue: Number(meta[6]),
                  imageUrl: undefined,
                  price: listing[2]?.toString() ?? "0",
                  listing: { listed: listing[3], price: Number(listing[2]) }
                };
              } catch {
                return null;
              }
            })()
          );
        }
        const all = (await Promise.all(metaPromises)).filter(Boolean) as Asset[];
        // Fallback: Wenn keine echten Assets, Demo-Assets anzeigen
        if (all.length === 0) {
          setTokens([
            { tokenId: 1, name: "Villa in Miami", owner: "0xA1...1", price: "10000", category: "Real Estate", description: "Luxusvilla in Miami.", estimatedValue: 10000, imageUrl: undefined, listing: { listed: true, price: 10000 } },
            { tokenId: 2, name: "Luxury Watch", owner: "0xB2...2", price: "5000", category: "Luxury Items", description: "Exklusive Uhr.", estimatedValue: 5000, imageUrl: undefined, listing: { listed: true, price: 5000 } },
            { tokenId: 3, name: "Art Piece", owner: "0xC3...3", price: "8000", category: "Art", description: "Kunstwerk.", estimatedValue: 8000, imageUrl: undefined, listing: { listed: true, price: 8000 } },
            { tokenId: 4, name: "Sports Car", owner: "0xD4...4", price: "20000", category: "Luxury Items", description: "Sportwagen.", estimatedValue: 20000, imageUrl: undefined, listing: { listed: true, price: 20000 } },
            { tokenId: 5, name: "Downtown Apartment", owner: "0xE5...5", price: "15000", category: "Real Estate", description: "Wohnung in der Innenstadt.", estimatedValue: 15000, imageUrl: undefined, listing: { listed: true, price: 15000 } },
            { tokenId: 6, name: "Rare Book", owner: "0xF6...6", price: "1200", category: "Collectibles", description: "Seltenes Buch.", estimatedValue: 1200, imageUrl: undefined, listing: { listed: true, price: 1200 } },
            { tokenId: 7, name: "Wine Collection", owner: "0xA7...7", price: "3000", category: "Collectibles", description: "Weinsammlung.", estimatedValue: 3000, imageUrl: undefined, listing: { listed: true, price: 3000 } },
            { tokenId: 8, name: "Yacht Share", owner: "0xB8...8", price: "25000", category: "Luxury Items", description: "Yacht-Anteil.", estimatedValue: 25000, imageUrl: undefined, listing: { listed: true, price: 25000 } },
            { tokenId: 9, name: "Antique Coin", owner: "0xC9...9", price: "900", category: "Collectibles", description: "Antike Münze.", estimatedValue: 900, imageUrl: undefined, listing: { listed: true, price: 900 } },
            { tokenId: 10, name: "Penthouse Berlin", owner: "0xD0...0", price: "22000", category: "Real Estate", description: "Penthouse in Berlin.", estimatedValue: 22000, imageUrl: undefined, listing: { listed: true, price: 22000 } },
          ]);
        } else {
          setTokens(all);
        }
      } catch {
        // Bei Fehler: Demo-Assets anzeigen
        setTokens([
          { tokenId: 1, name: "Villa in Miami", owner: "0xA1...1", price: "10000", category: "Real Estate", description: "Luxusvilla in Miami.", estimatedValue: 10000, imageUrl: undefined, listing: { listed: true, price: 10000 } },
          { tokenId: 2, name: "Luxury Watch", owner: "0xB2...2", price: "5000", category: "Luxury Items", description: "Exklusive Uhr.", estimatedValue: 5000, imageUrl: undefined, listing: { listed: true, price: 5000 } },
          { tokenId: 3, name: "Art Piece", owner: "0xC3...3", price: "8000", category: "Art", description: "Kunstwerk.", estimatedValue: 8000, imageUrl: undefined, listing: { listed: true, price: 8000 } },
          { tokenId: 4, name: "Sports Car", owner: "0xD4...4", price: "20000", category: "Luxury Items", description: "Sportwagen.", estimatedValue: 20000, imageUrl: undefined, listing: { listed: true, price: 20000 } },
          { tokenId: 5, name: "Downtown Apartment", owner: "0xE5...5", price: "15000", category: "Real Estate", description: "Wohnung in der Innenstadt.", estimatedValue: 15000, imageUrl: undefined, listing: { listed: true, price: 15000 } },
          { tokenId: 6, name: "Rare Book", owner: "0xF6...6", price: "1200", category: "Collectibles", description: "Seltenes Buch.", estimatedValue: 1200, imageUrl: undefined, listing: { listed: true, price: 1200 } },
          { tokenId: 7, name: "Wine Collection", owner: "0xA7...7", price: "3000", category: "Collectibles", description: "Weinsammlung.", estimatedValue: 3000, imageUrl: undefined, listing: { listed: true, price: 3000 } },
          { tokenId: 8, name: "Yacht Share", owner: "0xB8...8", price: "25000", category: "Luxury Items", description: "Yacht-Anteil.", estimatedValue: 25000, imageUrl: undefined, listing: { listed: true, price: 25000 } },
          { tokenId: 9, name: "Antique Coin", owner: "0xC9...9", price: "900", category: "Collectibles", description: "Antike Münze.", estimatedValue: 900, imageUrl: undefined, listing: { listed: true, price: 900 } },
          { tokenId: 10, name: "Penthouse Berlin", owner: "0xD0...0", price: "22000", category: "Real Estate", description: "Penthouse in Berlin.", estimatedValue: 22000, imageUrl: undefined, listing: { listed: true, price: 22000 } },
        ]);
      }
    };
    fetchTokens();
  }, [publicClient, refresh]);

  const handleSubmitOffer = async (e: React.FormEvent, tokenId: number, price: number) => {
    e.preventDefault();
    try {
      await createOffer({
        functionName: "createOffer",
        args: [tokenId, Number(interestRate), 30],
        value: toTinybars(price),
      });
      setOfferMsg("Offer created!");
      setShowBuy(null);
      setInterestRate("");
      setRefresh(r => r + 1);
    } catch (err) {
      setOfferMsg("Error: " + err?.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Marketplace</h1>
      <div className="mb-4 text-gray-400">
        Browse all tokenized assets. You can buy assets, make offers, or lend HBAR to co-own real-world assets.
        Click on an asset for more details or to interact.
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tokens.slice(0, 10).filter(asset => asset.owner !== currentUser.address).map(asset => {
          const img = asset.imageUrl || GENERIC_IMAGES[asset.category as keyof typeof GENERIC_IMAGES] || GENERIC_IMAGES["default"];
          return (
            <div key={asset.tokenId} className="card bg-base-100 shadow p-4">
              <img src={img} alt={asset.name} className="w-full h-40 object-cover rounded-xl mb-2" />
              <h2 className="font-bold text-lg">{asset.name}</h2>
              <div>Token ID: {asset.tokenId.toString()}</div>
              <div>Owner: {asset.owner}</div>
              <div>Category: {asset.category}</div>
              <div className="text-gray-400">Description: {asset.description}</div>
              <div>Estimated Value: {asset.estimatedValue} HBAR</div>
              {asset.listing?.listed && (
                <div className="text-green-600 font-bold">Listed for {asset.listing.price} HBAR</div>
              )}
              <button className="btn btn-primary mt-2 w-full" onClick={() => setShowBuy(asset.tokenId.toString())}>Buy</button>
              {showBuy === asset.tokenId.toString() && (
                <form onSubmit={e => { e.preventDefault(); setShowBuy(null); }} className="mt-2 space-y-2">
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    placeholder="Interest Rate (APR %)"
                    value={interestRate}
                    onChange={e => setInterestRate(e.target.value)}
                    required
                  />
                  <div className="text-xs text-gray-400">Enter the interest rate you are able to pay for the loan.</div>
                  <button className="btn btn-primary w-full" type="submit">Submit Offer</button>
                </form>
              )}
            </div>
          );
        })}
      </div>
      {offerMsg && <div className="mt-4 text-green-600">{offerMsg}</div>}
    </div>
  );
}