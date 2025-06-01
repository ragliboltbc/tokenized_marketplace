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
  const [form, setForm] = useState<any>({
    name: "",
    estimatedValue: "",
    description: "",
  });
  const [legalDoc, setLegalDoc] = useState<File | null>(null);
  const [aiValidated, setAiValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");
  const { currentUser } = useUser();
  const chainId = useChainId();

  const contractAvailable = deployedContracts?.[chainId]?.AssetNFT?.address;
  console.log(chainId, deployedContracts);
  const { writeContractAsync } = useScaffoldWriteContract({
    contractName: "AssetNFT",
  });

  const toTinybars = (hbar: string | number) => BigInt(Math.floor(Number(hbar) * 100_000_000));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    setForm({ ...form });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setLegalDoc(e.target.files[0]);
  };

  const handleValidateAI = () => {
    setAiValidated(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractAvailable) {
      alert("Contract not deployed on this network. Please run `yarn deploy`.");
      return;
    }

    setLoading(true);
    try {
      const args = [
        currentUser.address,
        form.name,
        category,
        form.description,
        form.assetType || "",
        form.vin || form.legalId || "",
        form.brand || "",
        toTinybars(form.estimatedValue),
      ];

      const tx = await writeContractAsync({
        functionName: "mint",
        args,
      });

      setTxHash(tx || "Success (no tx hash returned)");
    } catch (err: any) {
      setTxHash("Error: " + (err?.message || "Unknown error"));
    }
    setLoading(false);
  };

  const dynamicFields = categoryFields[category as keyof typeof categoryFields] || [];

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

}
