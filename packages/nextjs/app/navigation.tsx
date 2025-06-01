"use client";
import Link from "next/link";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";

export default function Navigation() {
  const { targetNetwork } = useTargetNetwork();
  const isHedera = targetNetwork.id === 296;
  return (
    <nav className="navbar bg-base-200 mb-4">
      <div className="container mx-auto flex gap-4">
        <Link className="btn btn-ghost normal-case text-xl" href="/">Home</Link>
        <Link className="btn btn-ghost" href="/mint">Mint</Link>
        <Link className="btn btn-ghost" href="/marketplace">Marketplace</Link>
        <Link className="btn btn-ghost" href="/lend">Lend</Link>
        <Link className="btn btn-ghost" href="/portfolio">Portfolio</Link>
        {isHedera ? (
          <a
            className="btn btn-ghost"
            href="https://blockscout.com/hedera/testnet/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Blockscout Explorer
          </a>
        ) : (
          <Link className="btn btn-ghost" href="/blockexplorer">Transactions</Link>
        )}
        <Link className="btn btn-ghost" href="/lenders">Lender Dashboard</Link>
      </div>
    </nav>
  );
} 