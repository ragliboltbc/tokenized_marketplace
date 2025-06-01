"use client";
import { useState, useEffect } from "react";

interface Asset {
  id: number;
  name: string;
  owner: string;
  price: string;
  category: string;
  status?: "available" | "financed";
  lendingAmount?: number;
  interestRate?: number;
  remainingDays?: number;
  expectedReturn?: number;
}

export default function LendPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [financedAssets, setFinancedAssets] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [activeTab, setActiveTab] = useState<"available" | "financed">("available");

  useEffect(() => {
    // Mock: Available assets for lending
    setAssets([
      { id: 1, name: "Villa in Miami", owner: "0xA1...1", price: "10000", category: "Real Estate", status: "available", interestRate: 8.5 },
      { id: 2, name: "Luxury Watch", owner: "0xB2...2", price: "5000", category: "Luxury Items", status: "available", interestRate: 7.2 },
      { id: 3, name: "Art Piece", owner: "0xC3...3", price: "8000", category: "Art", status: "available", interestRate: 6.8 },
      { id: 4, name: "Sports Car", owner: "0xD4...4", price: "20000", category: "Luxury Items", status: "available", interestRate: 9.0 },
      { id: 5, name: "Downtown Apartment", owner: "0xE5...5", price: "15000", category: "Real Estate", status: "available", interestRate: 7.8 }
    ]);

    // Mock: Assets you have financed
    setFinancedAssets([
      { 
        id: 6, 
        name: "Rare Book Collection", 
        owner: "0xF6...6", 
        price: "1200", 
        category: "Collectibles", 
        status: "financed",
        lendingAmount: 500,
        interestRate: 8.5,
        remainingDays: 25,
        expectedReturn: 542
      },
      { 
        id: 7, 
        name: "Wine Collection", 
        owner: "0xA7...7", 
        price: "3000", 
        category: "Collectibles", 
        status: "financed",
        lendingAmount: 1200,
        interestRate: 7.2,
        remainingDays: 45,
        expectedReturn: 1286
      },
      { 
        id: 8, 
        name: "Yacht Share", 
        owner: "0xB8...8", 
        price: "25000", 
        category: "Luxury Items", 
        status: "financed",
        lendingAmount: 10000,
        interestRate: 9.0,
        remainingDays: 60,
        expectedReturn: 10900
      }
    ]);
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
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lending Dashboard</h1>
      
      <div className="tabs tabs-boxed mb-4">
        <button 
          className={`tab ${activeTab === "available" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("available")}
        >
          Available Assets
        </button>
        <button 
          className={`tab ${activeTab === "financed" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("financed")}
        >
          My Financed Assets
        </button>
      </div>

      {activeTab === "available" ? (
        <div className="space-y-4">
          <div className="text-gray-400 mb-4">
            Browse available assets and lend HBAR to earn interest.
          </div>
          {assets.map(asset => (
            <div key={asset.id} className="card bg-base-100 shadow p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-bold text-lg">{asset.name}</h2>
                  <div>Category: {asset.category}</div>
                  <div>Owner: {asset.owner}</div>
                  <div>Asset Value: {asset.price} HBAR</div>
                  <div className="text-green-600">Interest Rate: {asset.interestRate}% APR</div>
                </div>
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    setSelectedAsset(asset.id.toString());
                    window.scrollTo(0, document.body.scrollHeight);
                  }}
                >
                  Lend
                </button>
              </div>
            </div>
          ))}

          <form onSubmit={handleSubmit} className="card bg-base-100 shadow p-4 mt-8">
            <h3 className="font-bold text-lg mb-4">Lend to Asset</h3>
            <div className="space-y-4">
              <select 
                className="select select-bordered w-full" 
                value={selectedAsset} 
                onChange={e => setSelectedAsset(e.target.value)} 
                required
              >
                <option value="">Select Asset</option>
                {assets.map(asset => (
                  <option key={asset.id} value={asset.id}>
                    {asset.name} - {asset.interestRate}% APR
                  </option>
                ))}
              </select>
              <input 
                name="amount" 
                placeholder="Amount (HBAR)" 
                type="number" 
                className="input input-bordered w-full" 
                value={amount} 
                onChange={e => setAmount(e.target.value)} 
                required 
              />
              <button 
                type="submit" 
                className="btn btn-primary w-full" 
                disabled={loading}
              >
                {loading ? "Processing..." : "Lend HBAR"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-gray-400 mb-4">
            View and manage your financed assets.
          </div>
          {financedAssets.map(asset => (
            <div key={asset.id} className="card bg-base-100 shadow p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-bold text-lg">{asset.name}</h2>
                  <div>Category: {asset.category}</div>
                  <div>Owner: {asset.owner}</div>
                  <div>Asset Value: {asset.price} HBAR</div>
                  <div className="text-green-600">Your Investment: {asset.lendingAmount} HBAR</div>
                  <div className="text-blue-600">Interest Rate: {asset.interestRate}% APR</div>
                  <div className="text-amber-600">Time Remaining: {asset.remainingDays} days</div>
                  <div className="text-emerald-600">Expected Return: {asset.expectedReturn} HBAR</div>
                </div>
                <div className="text-right">
                  <div className="badge badge-success">Active</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {txHash && (
        <div className="mt-4 alert alert-success">
          <div className="flex-1">
            <label>Transaction successful! Hash: {txHash}</label>
          </div>
        </div>
      )}
    </div>
  );
}