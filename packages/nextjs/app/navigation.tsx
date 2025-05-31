import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="navbar bg-base-200 mb-4">
      <div className="container mx-auto flex gap-4">
        <Link className="btn btn-ghost normal-case text-xl" href="/">Home</Link>
        <Link className="btn btn-ghost" href="/mint">Mint</Link>
        <Link className="btn btn-ghost" href="/marketplace">Marketplace</Link>
        <Link className="btn btn-ghost" href="/lend">Lend</Link>
        <Link className="btn btn-ghost" href="/portfolio">Portfolio</Link>
        <Link className="btn btn-ghost" href="/blockexplorer">Transactions</Link>
      </div>
    </nav>
  );
} 