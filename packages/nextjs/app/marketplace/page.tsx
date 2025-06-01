"use client";
import { useEffect, useState } from "react";
import { useUser } from "../../components/UserContext";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { CONTRACTS } from "../../constants";
import { usePublicClient } from "wagmi";

const toTinybars = (hbar: string | number) => BigInt(Math.floor(Number(hbar) * 100_000_000));
const fromTinybars = (tinybars: string | number | bigint) => Number(tinybars) / 100_000_000;

export default function MarketplacePage() {
  const { currentUser } = useUser();
  const { writeContractAsync: listAsset } = useScaffoldWriteContract({ contractName: "Marketplace" });
  const { writeContractAsync: createOffer } = useScaffoldWriteContract({ contractName: "Marketplace" });
  const publicClient = usePublicClient();
  const [tokens, setTokens] = useState<any[]>([]);
  const [listingPrice, setListingPrice] = useState("");
  const [showList, setShowList] = useState<number | null>(null);
  const [showOffer, setShowOffer] = useState<number | null>(null);
  const [interestRate, setInterestRate] = useState("");
  const [duration, setDuration] = useState("");
  const [offerMsg, setOfferMsg] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const fetchTokens = async () => {
      if (!publicClient) return setTokens([]);
      // Get total minted tokens
      let totalMinted = 0n;
      try {
        totalMinted = await publicClient.readContract({
          address: CONTRACTS.assetNFT as `0x${string}`,
          abi: [
            {
              "inputs": [],
              "name": "totalMinted",
              "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
              "stateMutability": "view",
              "type": "function"
            }
          ],
          functionName: "totalMinted",
        });
      } catch {
        setTokens([]);
        return;
      }
      // For each token, get metadata, owner, and listing
      const metaPromises = [];
      for (let i = 0n; i < totalMinted; i++) {
        metaPromises.push(
          (async () => {
            const [meta, owner, listing] = await Promise.all([
              publicClient.readContract({
                address: CONTRACTS.assetNFT as `0x${string}`,
                abi: [
                  {
                    "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
                    "name": "getAssetMetadata",
                    "outputs": [
                      { "internalType": "string", "name": "name", "type": "string" },
                      { "internalType": "string", "name": "category", "type": "string" },
                      { "internalType": "string", "name": "description", "type": "string" },
                      { "internalType": "string", "name": "assetType", "type": "string" },
                      { "internalType": "string", "name": "legalId", "type": "string" },
                      { "internalType": "string", "name": "brand", "type": "string" },
                      { "internalType": "uint256", "name": "estimatedValue", "type": "uint256" }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                  }
                ],
                functionName: "getAssetMetadata",
                args: [i],
              }),
              publicClient.readContract({
                address: CONTRACTS.assetNFT as `0x${string}`,
                abi: [
                  {
                    "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
                    "name": "ownerOf",
                    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
                    "stateMutability": "view",
                    "type": "function"
                  }
                ],
                functionName: "ownerOf",
                args: [i],
              }),
              publicClient.readContract({
                address: CONTRACTS.marketplace as `0x${string}`,
                abi: [
                  {
                    "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
                    "name": "listings",
                    "outputs": [
                      { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
                      { "internalType": "address", "name": "owner", "type": "address" },
                      { "internalType": "uint256", "name": "price", "type": "uint256" },
                      { "internalType": "bool", "name": "listed", "type": "bool" }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                  }
                ],
                functionName: "listings",
                args: [i],
              })
            ]);
            return { ...meta, tokenId: i, owner, listing };
          })()
        );
      }
      const all = (await Promise.all(metaPromises)).filter(Boolean);
      setTokens(all);
    };
    fetchTokens();
  }, [publicClient, refresh]);

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
            {asset.listing?.listed && (
              <div className="text-green-600 font-bold">Listed for {fromTinybars(asset.listing.price)} HBAR</div>
            )}
            {asset.owner === currentUser.address && (
              <>
                <button className="btn btn-secondary mt-2 w-full" onClick={() => handleList(asset.tokenId)}>List Asset</button>
                {showList === asset.tokenId && (
                  <form onSubmit={e => handleSubmitList(e, asset.tokenId)} className="mt-2 space-y-2">
                    <input
                      type="number"
                      className="input input-bordered w-full"
                      placeholder="Listing Price (HBAR)"
                      value={listingPrice}
                      onChange={e => setListingPrice(e.target.value)}
                      required
                    />
                    <button className="btn btn-primary w-full" type="submit">Submit Listing</button>
                  </form>
                )}
              </>
            )}
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
          </div>
        ))}
      </div>
      {offerMsg && <div className="mt-4 text-green-600">{offerMsg}</div>}
    </div>
  );
} 