"use client";
import { useState, useEffect } from "react";
import { useUser } from "../../components/UserContext";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { CONTRACTS } from "../../constants";
import { usePublicClient } from "wagmi";

const toTinybars = (hbar) => BigInt(Math.floor(Number(hbar) * 100_000_000));
const fromTinybars = (tinybars) => Number(tinybars) / 100_000_000;

const GENERIC_IMAGES = {
  "Real Estate": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  "Luxury Items": "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=400&q=80",
  "default": "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80"
};

export default function LendersPage() {
  const { currentUser } = useUser();
  const { writeContractAsync: contributeToOffer } = useScaffoldWriteContract({ contractName: "Marketplace" });
  const publicClient = usePublicClient();
  const [offers, setOffers] = useState([]);
  const [contributeId, setContributeId] = useState(null);
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");
  const [refresh, setRefresh] = useState(0);

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

                if (!offer || offer.status !== 0) return null;

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

                return { ...offer, id: i, asset };
              } catch {
                return null;
              }
            })()
          );
        }

        const all = (await Promise.all(offerPromises)).filter(Boolean);
        setOffers(all);
      } catch {
        setOffers([]);
      }
    };
    fetchOffers();
  }, [publicClient, refresh]);

  const handleContribute = (id) => {
    setContributeId(id);
    setMsg("");
  };

  const handleSubmit = async (e, offerId) => {
    e.preventDefault();
    try {
      await contributeToOffer({ functionName: "contributeToOffer", args: [offerId], value: toTinybars(amount) });
      setMsg("Contribution submitted!");
      setContributeId(null);
      setAmount("");
      setRefresh(r => r + 1);
    } catch (err) {
      setMsg("Error: " + err?.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lender Dashboard</h1>
      <div className="mb-4 text-gray-400">Browse open lending offers and contribute HBAR to co-own real-world assets. You can also see your outstanding debts and repay them.</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {offers.map(offer => {
          const img = offer.asset?.imageUrl || GENERIC_IMAGES[offer.asset?.category] || GENERIC_IMAGES["default"];
          const isBorrower = offer.buyer?.toLowerCase() === currentUser.address?.toLowerCase();
          return (
            <div key={offer.id} className="card bg-base-100 shadow p-4">
              <img src={img} alt={offer.asset?.name || "Asset"} className="w-full h-40 object-cover rounded-xl mb-2" />
              <h2 className="font-bold text-lg">{offer.asset?.name || "Asset"}</h2>
              <div>Buyer: {offer.buyer}</div>
              <div>Interest Rate: {offer.interestRate}%</div>
              <div>Price Needed: {fromTinybars(offer.price)} HBAR</div>
              <div>Raised: {fromTinybars(offer.amountRaised)} HBAR</div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(Number(offer.amountRaised) / Number(offer.price)) * 100}%` }}></div>
              </div>
              {isBorrower ? (
                <div className="mt-2">
                  <div className="text-sm text-yellow-700">Outstanding Debt: {fromTinybars(offer.price - offer.amountRaised)} HBAR</div>
                  <button className="btn btn-primary mt-1">Repay Loan</button>
                </div>
              ) : (
                <>
                  <button className="btn btn-secondary w-full" onClick={() => handleContribute(offer.id)}>Contribute</button>
                  {contributeId === offer.id && (
                    <form onSubmit={e => handleSubmit(e, offer.id)} className="mt-2 space-y-2">
                      <input
                        type="number"
                        className="input input-bordered w-full"
                        placeholder="Amount to lend (HBAR)"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        required
                      />
                      <button className="btn btn-primary w-full" type="submit">Submit</button>
                    </form>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
      {msg && <div className="mt-4 text-green-600">{msg}</div>}
    </div>
  );
}