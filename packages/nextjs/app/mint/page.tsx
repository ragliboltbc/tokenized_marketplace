"use client";

import { useState } from "react";
import { useUser } from "../../components/UserContext";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useChainId } from "wagmi";
import deployedContracts from "~~/contracts/deployedContracts";

const categoryFields = {
  Cars: [
    { name: "vin", label: "VIN", type: "text" },
    { name: "manufacturingYear", label: "Manufacturing Year", type: "number" },
    { name: "mileage", label: "Mileage", type: "number" },
  ],
  "Real Estate": [
    { name: "numberOfRooms", label: "Number of Rooms", type: "number" },
    { name: "buildYear", label: "Build Year", type: "number" },
  ],
  "Luxury Items": [
    { name: "brand", label: "Brand", type: "text" },
    { name: "model", label: "Model", type: "text" },
  ],
};

export default function MintAssetPage() {
  const [category, setCategory] = useState("");
  const [form, setForm] = useState({ name: "", estimatedValue: "", description: "" });
  const [legalDoc, setLegalDoc] = useState(null);
  const [aiValidated, setAiValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");
  const { currentUser } = useUser();
  const chainId = useChainId();

  const contractAvailable = deployedContracts?.[String(chainId)]?.AssetNFT?.address;
  const { writeContractAsync } = useScaffoldWriteContract({ contractName: "AssetNFT" });

  const toTinybars = (hbar) => {
    const num = Number(hbar);
    return isNaN(num) || !isFinite(num) ? BigInt(0) : BigInt(Math.floor(num * 100_000_000));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setForm({ ...form });
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) setLegalDoc(e.target.files[0]);
  };

  const handleValidateAI = () => setAiValidated(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contractAvailable) {
      alert("Contract not deployed on this network. Please run `yarn deploy`.");
      return;
    }
    setLoading(true);
    try {
      const args = [
        String(currentUser.address),
        String(form.name || ""),
        String(category || ""),
        String(form.description || ""),
        String(form.assetType || ""),
        String(form.vin || form.legalId || ""),
        String(form.brand || form.model || ""),
        toTinybars(form.estimatedValue ?? "0"),
        String(form.imageUrl || "https://images.unsplash.com/photo-1511918984145-48de785d4c4e?auto=format&fit=crop&w=400&q=80")
      ];

      const tx = await writeContractAsync({
        functionName: "mint",
        args,
        gas: 1_000_000,
      });

      setTxHash(tx || "Success (no tx hash returned)");
    } catch (err) {
      setTxHash("Error: " + (err?.message || "Unknown error"));
    }
    setLoading(false);
  };

  const dynamicFields = categoryFields[category] || [];

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mint Asset NFT</h1>

      {!contractAvailable && (
        <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 border border-yellow-400 rounded">
          ⚠️ Contract not found for chainId: {chainId}.<br />
          Please run <code>yarn deploy</code> or switch to the correct network.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Asset Name"
          className="input input-bordered w-full"
          value={form.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          className="textarea textarea-bordered w-full"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          name="estimatedValue"
          placeholder="Estimated Value (HBAR)"
          type="number"
          className="input input-bordered w-full"
          value={form.estimatedValue}
          onChange={handleChange}
          required
        />
        <select
          name="category"
          className="select select-bordered w-full"
          value={category}
          onChange={handleCategoryChange}
          required
        >
          <option value="">Select Category</option>
          {Object.keys(categoryFields).map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {dynamicFields.map(field => (
          <input
            key={field.name}
            name={field.name}
            placeholder={field.label}
            type={field.type}
            className="input input-bordered w-full"
            value={form[field.name] || ""}
            onChange={handleChange}
            required
          />
        ))}

        <input
          name="imageUrl"
          placeholder="Image URL (optional)"
          className="input input-bordered w-full"
          value={form.imageUrl || ""}
          onChange={handleChange}
        />

        <div>
          <label className="block mb-1 font-medium">Upload Legal Document</label>
          <input type="file" className="file-input file-input-bordered w-full" onChange={handleFileChange} />
        </div>

        <button type="button" className="btn btn-info w-full" onClick={handleValidateAI} disabled={aiValidated}>
          {aiValidated ? "Validated with AI" : "Validate with AI"}
        </button>

        <button type="submit" className="btn btn-primary w-full" disabled={loading || !contractAvailable}>
          {loading ? "Minting..." : "Mint NFT"}
        </button>
      </form>

      {txHash && <div className="mt-4 text-green-600 break-all">Tx Result: {txHash}</div>}
    </div>
  );
}
