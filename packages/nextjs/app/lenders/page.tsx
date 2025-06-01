"use client";
import { useState, useEffect } from "react";
import { useUser } from "../../components/UserContext";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function LendersPage() {
  const { currentUser } = useUser();
  const { writeContractAsync: contributeToOffer } = useScaffoldWriteContract({ contractName: "Marketplace" });
  const [offers, setOffers] = useState<any[]>([]);
  const [contributeId, setContributeId] = useState<number | null>(null);
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");
  const [refresh, setRefresh] = useState(0);

  const toTinybars = (hbar: string | number) => BigInt(Math.floor(Number(hbar) * 100_000_000));
  const fromTinybars = (tinybars: string | number | bigint) => Number(tinybars) / 100_000_000;

  // Fetch open offers (for demo, check first 10 offers)
  useEffect(() => {
    const fetchOffers = async () => {
      const total = 10;
      const offerPromises = [];
      for (let i = 0; i < total; i++) {
        offerPromises.push(
          window.scaffoldEth?.readContract({
            contractName: "Marketplace",
            functionName: "offers",
            args: [i],
          }).then(async offer => {
            if (!offer || offer.status !== 0) return null; // Only open offers
            const asset = await window.scaffoldEth?.readContract({
              contractName: "AssetNFT",
              functionName: "getAssetMetadata",
              args: [offer.tokenId],
            });
            return { ...offer, id: i, asset };
          })
        );
      }
      const all = await Promise.all(offerPromises);
      setOffers(all.filter(Boolean));
    };
    fetchOffers();
  }, [refresh]);

  const handleContribute = (id: number) => {
    setContributeId(id);
    setMsg("");
  };

  const handleSubmit = async (e: React.FormEvent, offerId: number) => {
    e.preventDefault();
    try {
      await contributeToOffer({ functionName: "contributeToOffer", args: [offerId], value: toTinybars(amount) });
      setMsg("Contribution submitted!");
      setContributeId(null);
      setAmount("");
      setRefresh(r => r + 1);
    } catch (err) {
      setMsg("Error: " + (err as any)?.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lender Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {offers.map(offer => (
          <div key={offer.id} className="card bg-base-100 shadow p-4">
            <h2 className="font-bold text-lg">{offer.asset?.name || "Asset"}</h2>
            <div>Buyer: {offer.buyer}</div>
            <div>Interest Rate: {offer.interestRate}%</div>
            <div>Price Needed: {fromTinybars(offer.price)} HBAR</div>
            <div>Raised: {fromTinybars(offer.amountRaised)} HBAR</div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(Number(offer.amountRaised) / Number(offer.price)) * 100}%` }}></div>
            </div>
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
          </div>
        ))}
      </div>
      {msg && <div className="mt-4 text-green-600">{msg}</div>}
    </div>
  );
} 