"use client";
import { useState, useEffect } from "react";

export default function LendPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [selectedAsset, setSelectedAsset] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");

  useEffect(() => {
    fetch("/api/assets")
      .then(res => res.json())
      .then(data => setAssets(data.assets));
  }, []);

  const toTinybars = (hbar: string | number) => BigInt(Math.floor(Number(hbar) * 100_000_000));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const tinybarAmount = toTinybars(amount);
    // TODO: Call contract to lend HBAR
    setTimeout(() => {
      setTxHash("0x456...def");
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lend to Asset</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select className="select select-bordered w-full" value={selectedAsset} onChange={e => setSelectedAsset(e.target.value)} required>
          <option value="">Select Asset</option>
          {assets.map(asset => (
            <option key={asset.id} value={asset.id}>{asset.name}</option>
          ))}
        </select>
        <input name="amount" placeholder="Amount (HBAR)" type="number" className="input input-bordered w-full" value={amount} onChange={e => setAmount(e.target.value)} required />
        <button type="submit" className="btn btn-primary w-full" disabled={loading}>{loading ? "Lending..." : "Lend"}</button>
      </form>
      {txHash && <div className="mt-4 text-green-600">Lent! Tx: {txHash}</div>}
    </div>
  );
} 