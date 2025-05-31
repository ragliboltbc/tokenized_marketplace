"use client";
import { useState } from "react";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    setForm({ ...form }); // reset category-specific fields
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLegalDoc(e.target.files[0]);
    }
  };

  const handleValidateAI = () => {
    setAiValidated(true);
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

  const fields = categoryFields[category as keyof typeof categoryFields] || [];

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mint Asset NFT</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Asset Name" className="input input-bordered w-full" value={form.name} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" className="textarea textarea-bordered w-full" value={form.description} onChange={handleChange} required />
        <input name="estimatedValue" placeholder="Estimated Value (ETH)" type="number" className="input input-bordered w-full" value={form.estimatedValue} onChange={handleChange} required />
        <select name="category" className="select select-bordered w-full" value={category} onChange={handleCategoryChange} required>
          <option value="">Select Category</option>
          <option value="Cars">Cars</option>
          <option value="Real Estate">Real Estate</option>
          <option value="Luxury Items">Luxury Items</option>
        </select>
        {fields.map(field => (
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
        <button type="submit" className="btn btn-primary w-full" disabled={loading}>{loading ? "Minting..." : "Mint NFT"}</button>
      </form>
      {txHash && <div className="mt-4 text-green-600">Minted! Tx: {txHash}</div>}
    </div>
  );
} 