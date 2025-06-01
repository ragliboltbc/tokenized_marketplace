"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import Image from "next/image";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
      <div className="flex flex-col items-center mt-16">
        <Image src="/tokenized-marketplace-logo.png" alt="Tokenized Marketplace Logo" width={120} height={120} />
        <h1 className="text-4xl font-bold mt-6 mb-2 text-blue-900">Tokenized Marketplace</h1>
        <p className="text-lg text-blue-800 max-w-xl text-center mb-6">
          Tokenize real-world assets, enable lending-based co-ownership, and manage your digital portfolio on Hedera. Mint, list, lend, and invest in physical assets with full transparency and compliance.
        </p>
        <div className="flex gap-4 mt-4">
          <Link href="/mint" className="btn btn-primary btn-lg">Mint Asset</Link>
          <Link href="/marketplace" className="btn btn-secondary btn-lg">Marketplace</Link>
          <Link href="/lenders" className="btn btn-accent btn-lg">Lender Dashboard</Link>
          <Link href="/portfolio" className="btn btn-outline btn-lg">My Portfolio</Link>
        </div>
      </div>
      <div className="mt-16 max-w-2xl text-center text-blue-900">
        <h2 className="text-2xl font-semibold mb-2">What is Tokenized Marketplace?</h2>
        <p className="mb-4">A decentralized platform for tokenizing real-world assets (RWAs) and enabling lending-based co-ownership. Built on Hedera, it lets you mint NFTs for physical assets, lend HBAR, and receive proportional ownership tokens. All actions are transparent, auditable, and ready for the future of digital asset management.</p>
        <ul className="list-disc list-inside text-left mx-auto max-w-lg">
          <li>Mint NFTs for cars, real estate, collectibles, and more</li>
          <li>List and trade assets in a secure, open marketplace</li>
          <li>Lend HBAR and earn fractional ownership</li>
          <li>Track your portfolio and lending shares in real time</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
