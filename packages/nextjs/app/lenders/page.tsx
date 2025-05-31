"use client";
import { useState } from "react";

const mockOffers = [
  {
    id: 1,
    asset: "Luxury Car",
    price: 100,
    raised: 60,
    interestRate: 8,
    buyer: "0xaaa...",
    lenders: [
      { address: "0xabc...", amount: 30 },
      { address: "0xdef...", amount: 30 },
    ],
  },
  {
    id: 2,
    asset: "Beach House",
    price: 500,
    raised: 200,
    interestRate: 10,
    buyer: "0xbbb...",
    lenders: [
      { address: "0xghi...", amount: 200 },
    ],
  },
];

export default function LendersPage() {
  const [contributeId, setContributeId] = useState<number | null>(null);
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");

  const handleContribute = (id: number) => {
    setContributeId(id);
    setMsg("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("Contribution submitted! (Demo)");
    setContributeId(null);
    setAmount("");
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lender Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockOffers.map(offer => (
          <div key={offer.id} className="card bg-base-100 shadow p-4">
            <h2 className="font-bold text-lg">{offer.asset}</h2>
            <div>Buyer: {offer.buyer}</div>
            <div>Interest Rate: {offer.interestRate}%</div>
            <div>Price Needed: {offer.price} ETH</div>
            <div>Raised: {offer.raised} ETH</div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(offer.raised / offer.price) * 100}%` }}></div>
            </div>
            <div className="mb-2">Lenders: {offer.lenders.map(l => `${l.address} (${l.amount} ETH)`).join(", ")}</div>
            <button className="btn btn-secondary w-full" onClick={() => handleContribute(offer.id)}>Contribute</button>
            {contributeId === offer.id && (
              <form onSubmit={handleSubmit} className="mt-2 space-y-2">
                <input
                  type="number"
                  className="input input-bordered w-full"
                  placeholder="Amount to lend (ETH)"
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