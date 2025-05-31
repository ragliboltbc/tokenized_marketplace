"use client";

import { useState } from "react";

export default function MintAssetPage() {
  const [form, setForm] = useState({
    name: "",
    assetType: "",
    legalId: "",
    brand: "",
    estimatedValue: "",
  });
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Call backend or contract interaction to mint NFT
    setTimeout(() => {
      setTxHash("0x123...abc");
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mint Asset NFT</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Asset Name"
          className="input input-bordered w-full"
          value={form.name}
          onChange={handleChange}
          required
          autoComplete="off"
          style={{
            color: "#1e293b",
            background: "rgba(255,255,255,0.05)",
            zIndex: 10,
            position: "relative",
          }}
        />
        <input
          name="assetType"
          placeholder="Asset Type (e.g. Car, House)"
          className="input input-bordered w-full"
          value={form.assetType}
          onChange={handleChange}
          required
          autoComplete="off"
          style={{
            color: "#1e293b",
            background: "rgba(255,255,255,0.05)",
            zIndex: 10,
            position: "relative",
          }}
        />
        <input
          name="legalId"
          placeholder="Legal ID (e.g. VIN)"
          className="input input-bordered w-full"
          value={form.legalId}
          onChange={handleChange}
          required
          autoComplete="off"
          style={{
            color: "#1e293b",
            background: "rgba(255,255,255,0.05)",
            zIndex: 10,
            position: "relative",
          }}
        />
        <input
          name="brand"
          placeholder="Brand"
          className="input input-bordered w-full"
          value={form.brand}
          onChange={handleChange}
          required
          autoComplete="off"
          style={{
            color: "#1e293b",
            background: "rgba(255,255,255,0.05)",
            zIndex: 10,
            position: "relative",
          }}
        />
        <input
          name="estimatedValue"
          placeholder="Estimated Value (ETH)"
          type="number"
          className="input input-bordered w-full"
          value={form.estimatedValue}
          onChange={handleChange}
          required
          autoComplete="off"
          style={{
            color: "#1e293b",
            background: "rgba(255,255,255,0.05)",
            zIndex: 10,
            position: "relative",
          }}
        />
        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? "Minting..." : "Mint NFT"}
        </button>
      </form>
      {txHash && <div className="mt-4 text-green-600">Minted! Tx: {txHash}</div>}
    </div>
  );
}
