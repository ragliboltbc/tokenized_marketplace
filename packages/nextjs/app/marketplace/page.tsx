"use client";
import { useState, useEffect } from "react";

const mockListings = [
  { id: 1, name: "Luxury Car", owner: "0xabc...", price: 100, listed: true },
  { id: 2, name: "Beach House", owner: "0xdef...", price: 500, listed: true },
];

export default function MarketplacePage() {
  const [listings, setListings] = useState<any[]>([]);
  const [showOffer, setShowOffer] = useState<number | null>(null);
  const [interestRate, setInterestRate] = useState("");
  const [duration, setDuration] = useState("");
  const [offerMsg, setOfferMsg] = useState("");

  useEffect(() => {
    setListings(mockListings);
  }, []);

  const handleOffer = (id: number) => {
    setShowOffer(id);
    setOfferMsg("");
  };

  const handleSubmitOffer = (e: React.FormEvent) => {
    e.preventDefault();
    setOfferMsg("Offer created! (Demo)");
    setShowOffer(null);
    setInterestRate("");
    setDuration("");
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Marketplace</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {listings.map(asset => (
          <div key={asset.id} className="card bg-base-100 shadow p-4">
            <h2 className="font-bold text-lg">{asset.name}</h2>
            <div>Owner: {asset.owner}</div>
            <div>Price: {asset.price} ETH</div>
            <button className="btn btn-secondary mt-2 w-full" onClick={() => handleOffer(asset.id)}>Initiate Purchase Offer</button>
            {showOffer === asset.id && (
              <form onSubmit={handleSubmitOffer} className="mt-2 space-y-2">
                <input
                  type="number"
                  className="input input-bordered w-full"
                  placeholder="Interest Rate (APR %)"
                  value={interestRate}
                  onChange={e => setInterestRate(e.target.value)}
                  required
                />
                <input
                  type="number"
                  className="input input-bordered w-full"
                  placeholder="Duration (days)"
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                />
                <button className="btn btn-primary w-full" type="submit">Submit Offer</button>
              </form>
            )}
          </div>
        ))}
      </div>
      {offerMsg && <div className="mt-4 text-green-600">{offerMsg}</div>}
    </div>
  );
} 