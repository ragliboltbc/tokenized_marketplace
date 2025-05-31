"use client";
import { useState, useEffect } from "react";

export default function PortfolioPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [lending, setLending] = useState<any[]>([]);
  const userAddress = "0xabc..."; // TODO: Replace with wallet address from context

  useEffect(() => {
    fetch("/api/assets").then(res => res.json()).then(data => setAssets(data.assets));
    fetch("/api/lending").then(res => res.json()).then(data => setLending(data.lending));
  }, []);

  // Filter lending records for this user
  const myLending = lending.filter(l => l.lender === userAddress);
  const myPortfolio = myLending.map(l => {
    const asset = assets.find(a => a.id === l.assetId);
    return asset ? { ...asset, amount: l.amount } : null;
  }).filter(Boolean);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Portfolio</h1>
      <div className="space-y-4">
        {myPortfolio.map(asset => (
          <div key={asset.id} className="card bg-base-100 shadow p-4">
            <h2 className="font-bold text-lg">{asset.name}</h2>
            <div>Amount Lent: {asset.amount} ETH</div>
            <div>Claimable Interest: 0 ETH</div>
            <button className="btn btn-success mt-2">Claim</button>
          </div>
        ))}
      </div>
    </div>
  );
} 