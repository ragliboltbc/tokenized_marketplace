"use client";
import { useEffect, useState } from "react";
import { useUser } from "../../components/UserContext";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const toTinybars = (hbar: string | number) => BigInt(Math.floor(Number(hbar) * 100_000_000));
const fromTinybars = (tinybars: string | number | bigint) => Number(tinybars) / 100_000_000;

export default function MarketplacePage() {
  const { currentUser } = useUser();
  const { writeContractAsync: listAsset } = useScaffoldWriteContract({ contractName: "Marketplace" });
  const { writeContractAsync: createOffer } = useScaffoldWriteContract({ contractName: "Marketplace" });
  const [tokens, setTokens] = useState<any[]>([]);
  const [listingPrice, setListingPrice] = useState("");
  const [showList, setShowList] = useState<number | null>(null);
  const [showOffer, setShowOffer] = useState<number | null>(null);
  const [interestRate, setInterestRate] = useState("");
  const [duration, setDuration] = useState("");
  const [offerMsg, setOfferMsg] = useState("");
  const [refresh, setRefresh] = useState(0);

  // Fetch all tokens and their owners
  useEffect(() => {
    const fetchTokens = async () => {
      const total = 10; // For demo, check first 10 tokens
      const tokenPromises = [];
      for (let i = 0; i < total; i++) {
        tokenPromises.push(
          window.scaffoldEth?.readContract({
            contractName: "AssetNFT",
            functionName: "getAssetMetadata",
            args: [i],
          }).then(async meta => {
            if (!meta) return null;
            const owner = await window.scaffoldEth?.readContract({
              contractName: "AssetNFT",
              functionName: "ownerOf",
              args: [i],
            });
            return { ...meta, tokenId: i, owner };
          })
        );
      }
      const all = await Promise.all(tokenPromises);
      setTokens(all.filter(Boolean));
    };
    fetchTokens();
  }, [refresh]);

  const handleList = (tokenId: number) => {
    setShowList(tokenId);
    setListingPrice("");
  };

  const handleSubmitList = async (e: React.FormEvent, tokenId: number) => {
    e.preventDefault();
    try {
      await listAsset({ functionName: "listAsset", args: [tokenId, toTinybars(listingPrice)] });
      setOfferMsg("Asset listed!");
      setShowList(null);
      setRefresh(r => r + 1);
    } catch (err) {
      setOfferMsg("Error: " + (err as any)?.message);
    }
  };

  const handleOffer = (tokenId: number) => {
    setShowOffer(tokenId);
    setInterestRate("");
    setDuration("");
    setOfferMsg("");
  };

  const handleSubmitOffer = async (e: React.FormEvent, tokenId: number, price: number) => {
    e.preventDefault();
    try {
      await createOffer({
        functionName: "createOffer",
        args: [tokenId, Number(interestRate), Number(duration)],
        value: toTinybars(price),
      });
      setOfferMsg("Offer created!");
      setShowOffer(null);
      setRefresh(r => r + 1);
    } catch (err) {
      setOfferMsg("Error: " + (err as any)?.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Marketplace</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tokens.map(asset => (
          <div key={asset.tokenId} className="card bg-base-100 shadow p-4">
            <h2 className="font-bold text-lg">{asset.name}</h2>
            <div>Token ID: {asset.tokenId}</div>
            <div>Owner: {asset.owner}</div>
            <div>Category: {asset.category}</div>
            <div>Description: {asset.description}</div>
            <div>Estimated Value: {fromTinybars(asset.estimatedValue)} HBAR</div>
            {asset.owner === currentUser.address && (
              <>
                <button className="btn btn-secondary mt-2 w-full" onClick={() => handleList(asset.tokenId)}>List Asset</button>
                {showList === asset.tokenId && (
                  <form onSubmit={e => handleSubmitList(e, asset.tokenId)} className="mt-2 space-y-2">
                    <input
                      type="number"
                      className="input input-bordered w-full"
                      placeholder="Listing Price (ETH)"
                      value={listingPrice}
                      onChange={e => setListingPrice(e.target.value)}
                      required
                    />
                    <button className="btn btn-primary w-full" type="submit">Submit Listing</button>
                  </form>
                )}
              </>
            )}
            {asset.owner !== currentUser.address && (
              <>
                <button className="btn btn-secondary mt-2 w-full" onClick={() => handleOffer(asset.tokenId)}>Initiate Purchase Offer</button>
                {showOffer === asset.tokenId && (
                  <form onSubmit={e => handleSubmitOffer(e, asset.tokenId, asset.estimatedValue)} className="mt-2 space-y-2">
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
              </>
            )}
          </div>
        ))}
      </div>
      {offerMsg && <div className="mt-4 text-green-600">{offerMsg}</div>}
    </div>
  );
} 