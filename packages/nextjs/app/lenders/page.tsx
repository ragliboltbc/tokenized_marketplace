"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useUser } from "../../components/UserContext";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { CONTRACTS } from "../../constants";
import { usePublicClient } from "wagmi";

interface AssetMetadata {
  name: string;
  category: string;
  description: string;
  assetType: string;
  legalId: string;
  brand: string;
  estimatedValue: bigint;
  imageUrl?: string;
}

interface Offer {
  id: bigint;
  tokenId: bigint;
  buyer: string;
  price: bigint;
  interestRate: bigint;
  duration: bigint;
  amountRaised: bigint;
  status: number;
  asset?: AssetMetadata;
}

const toTinybars = (hbar: number | string): bigint => BigInt(Math.floor(Number(hbar) * 100_000_000));
const fromTinybars = (tinybars: bigint): number => Number(tinybars) / 100_000_000;

const GENERIC_IMAGES = {
  "Real Estate": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  "Luxury Items": "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=400&q=80",
  "default": "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80"
};

export default function LendersPage() {
  const { currentUser } = useUser();
  const { writeContractAsync: contributeToOffer } = useScaffoldWriteContract({ contractName: "Marketplace" });
  const publicClient = usePublicClient();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [contributeId, setContributeId] = useState<bigint | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [msg, setMsg] = useState<string>("");
  const [refresh, setRefresh] = useState<number>(0);
  const [totalInvestment, setTotalInvestment] = useState<number>(0);
  const [activeOffers, setActiveOffers] = useState(0);

  useEffect(() => {
    const fetchOffers = async () => {
      if (!publicClient) return setOffers([]);
      try {
        const totalOffers = await publicClient.readContract({
          address: CONTRACTS.marketplace,
          abi: [{
            inputs: [],
            name: "nextOfferId",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            stateMutability: "view",
            type: "function"
          }],
          functionName: "nextOfferId",
        });

        const offerPromises = [];
        for (let i = 0n; i < totalOffers; i++) {
          offerPromises.push(
            (async () => {
              try {
                const offer = await publicClient.readContract({
                  address: CONTRACTS.marketplace,
                  abi: [{
                    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
                    name: "offers",
                    outputs: [
                      { internalType: "uint256", name: "offerId", type: "uint256" },
                      { internalType: "uint256", name: "tokenId", type: "uint256" },
                      { internalType: "address", name: "buyer", type: "address" },
                      { internalType: "uint256", name: "price", type: "uint256" },
                      { internalType: "uint256", name: "interestRate", type: "uint256" },
                      { internalType: "uint256", name: "duration", type: "uint256" },
                      { internalType: "uint256", name: "amountRaised", type: "uint256" },
                      { internalType: "uint8", name: "status", type: "uint8" }
                    ],
                    stateMutability: "view",
                    type: "function"
                  }],
                  functionName: "offers",
                  args: [i],
                });

                if (!offer || offer[7] !== 0) return null;

                // Map the array to proper offer structure
                const mappedOffer: Offer = {
                  id: i,
                  tokenId: offer[1],
                  buyer: offer[2],
                  price: offer[3],
                  interestRate: offer[4],
                  duration: offer[5],
                  amountRaised: offer[6],
                  status: offer[7]
                };

                const asset = await publicClient.readContract({
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
                  args: [offer.tokenId],
                });

                const mappedAsset: AssetMetadata = {
                  name: asset[0],
                  category: asset[1],
                  description: asset[2],
                  assetType: asset[3],
                  legalId: asset[4],
                  brand: asset[5],
                  estimatedValue: asset[6]
                };

                return { ...mappedOffer, asset: mappedAsset };
              } catch {
                return null;
              }
            })()
          );
        }

        const all = (await Promise.all(offerPromises)).filter((offer): offer is Offer => offer !== null);
        setOffers(all);
        // Calculate statistics
        let total = 0;
        all.forEach(offer => {
          total += fromTinybars(offer.amountRaised);
        });
        setTotalInvestment(total);
        setActiveOffers(all.length);
      } catch {
        setOffers([]);
      }
    };
    fetchOffers();
    const interval = setInterval(fetchOffers, 5000);
    return () => clearInterval(interval);
  }, [publicClient, refresh]);

  const handleContribute = (id: bigint) => {
    setContributeId(id);
    setMsg("");
  };

  const handleSubmit = async (e: React.FormEvent, offerId: bigint) => {
    e.preventDefault();
    try {
      await contributeToOffer({ 
        contractName: "Marketplace",
        functionName: "contributeToOffer", 
        args: [offerId], 
        value: toTinybars(amount) 
      });
      setMsg("Contribution submitted!");
      setContributeId(null);
      setAmount("");
      setRefresh(r => r + 1);
    } catch (err: any) {
      setMsg("Error: " + (err?.message || "Unknown error"));
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 relative">
            <Image src="/tokenized-marketplace-logo.png" alt="Logo" fill className="object-contain" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Lender Dashboard</h1>
            <p className="text-gray-400">Manage your lending portfolio and co-own real-world assets</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="stat bg-base-100 shadow rounded-box p-4">
            <div className="stat-title">Total Investment</div>
            <div className="stat-value text-primary">{totalInvestment.toFixed(2)} HBAR</div>
          </div>
          <div className="stat bg-base-100 shadow rounded-box p-4">
            <div className="stat-title">Active Offers</div>
            <div className="stat-value text-secondary">{activeOffers}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {offers.map(offer => {
          const img = offer.asset?.imageUrl || (offer.asset?.category ? GENERIC_IMAGES[offer.asset.category as keyof typeof GENERIC_IMAGES] : GENERIC_IMAGES["default"]);
          const isBorrower = offer.buyer.toLowerCase() === currentUser.address?.toLowerCase();
          const progress = (fromTinybars(offer.amountRaised) / fromTinybars(offer.price)) * 100;
          return (
            <div key={offer.id} className="card bg-base-100 shadow p-4">
              <img src={img} alt={offer.asset?.name || "Asset"} className="w-full h-40 object-cover rounded-xl mb-2" />
              <h2 className="font-bold text-lg">{offer.asset?.name || "Asset"}</h2>
              <div className="grid grid-cols-2 gap-2 my-2">
                <div className="text-sm">Investment Goal:</div>
                <div className="text-sm font-medium text-right">{fromTinybars(offer.price)} HBAR</div>
                <div className="text-sm">Interest Rate:</div>
                <div className="text-sm font-medium text-right text-green-600">{fromTinybars(offer.interestRate)}% APR</div>
                <div className="text-sm">Amount Raised:</div>
                <div className="text-sm font-medium text-right">{fromTinybars(offer.amountRaised)} HBAR</div>
                <div className="text-sm">Duration:</div>
                <div className="text-sm font-medium text-right">{Number(offer.duration)} days</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div 
                  className="bg-primary h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              {isBorrower ? (
                <div className="mt-2">
                  <div className="text-sm text-yellow-700">Outstanding: {fromTinybars(offer.price - offer.amountRaised)} HBAR</div>
                  <button className="btn btn-primary w-full mt-1">Repay Loan</button>
                </div>
              ) : (
                <>
                  <button className="btn btn-primary w-full" onClick={() => handleContribute(offer.id)}>
                    Contribute to Offer
                  </button>
                  {contributeId === offer.id && (
                    <form onSubmit={e => handleSubmit(e, offer.id)} className="mt-2">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Amount to contribute (HBAR)</span>
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            step="0.000001"
                            className="input input-bordered w-full"
                            placeholder="Amount"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            required
                          />
                          <button className="btn btn-primary" type="submit">Submit</button>
                        </div>
                      </div>
                    </form>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
      {msg && <div className="mt-4 text-center text-green-600 font-medium">{msg}</div>}
      {offers.length === 0 && (
        <div className="text-center p-8">
          <div className="text-gray-400">No active offers available at the moment.</div>
        </div>
      )}
    </div>
  );
}