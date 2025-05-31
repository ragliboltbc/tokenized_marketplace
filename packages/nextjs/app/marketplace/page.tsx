"use client";
import { useState, useEffect } from "react";

export default function MarketplacePage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("/api/assets")
      .then(res => res.json())
      .then(data => setAssets(data.assets));
  }, []);

  const filteredAssets = filter ? assets.filter(a => a.assetType.toLowerCase().includes(filter.toLowerCase())) : assets;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Marketplace</h1>
      <input
        className="input input-bordered w-full mb-4"
        placeholder="Filter by category (e.g. Car, House)"
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAssets.map(asset => (
          <div key={asset.id} className="card bg-base-100 shadow p-4">
            <h2 className="font-bold text-lg">{asset.name}</h2>
            <div>Type: {asset.assetType}</div>
            <div>Brand: {asset.brand}</div>
            <div>Value: {asset.estimatedValue} ETH</div>
            <div>Funded: {asset.funded} ETH</div>
            <button className="btn btn-secondary mt-2 w-full">View & Lend</button>
          </div>
        ))}
      </div>
    </div>
  );
} 